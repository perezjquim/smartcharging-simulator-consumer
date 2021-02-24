import time
import threading
import requests
import inspect
from datetime import date, datetime, timedelta
from .SingletonMetaClass import SingletonMetaClass
from .ConfigurationHelper import ConfigurationHelper
from .Logger import Logger
from .Car import Car

class Simulator( metaclass = SingletonMetaClass ):

	MAIN_LOG_PREFIX = '============================'

	GATEWAY_REQUEST_BASE = 'http://cont_energysim_gateway:8000/{}'

	_main_thread = None	
	_config = { }
	_cars = [ ]

	_current_step = 1
	_current_datetime = None
	_affluence_counts = { }

	_current_step_lock = None
	_current_datetime_lock = None

	_charging_plugs_semaphore = None

	def on_init( self ):
		self._current_step_lock = threading.Lock( )
		self._current_datetime_lock = threading.Lock( )
		self._fetch_config( )
		self._initialize_cars( )
		self._initialize_datetime( )	
		self._current_step = 1	
		self._main_thread = threading.Thread( target = self.run )
		self._main_thread.start( )

		number_of_charging_plugs = self.get_config( 'number_of_charging_plugs' )
		self._charging_plugs_semaphore = threading.Semaphore( number_of_charging_plugs )

	def _fetch_config( self ):
		self.log_main( "Fetching config..." )

		self._config = ConfigurationHelper.read_config( )
		self.log_debug( 'Config >> {}'.format( self._config ) )

		self.log_main( "Fetching config... done!" )

	def log( self, message ):
		Logger.log( message )

	def log_main( self, message ):
		self.log( '{} {}'.format( Simulator.MAIN_LOG_PREFIX, message ) ) 

	def log_debug( self, message ):
		Logger.log_debug( message )

	def get_config( self, config_key ):
		return self._config[ config_key ]

	def run( self ):	
		self._begin_simulation( )

	def _initialize_cars( self ):
		self.log_main( 'Initializing cars...' )

		number_of_cars = self.get_config( 'number_of_cars' )
		for n in range( number_of_cars ):
			self._cars.append( Car( self ) )

		self.log_main( 'Initializing cars... done!' )

	def _initialize_datetime( self ):
		self.log_main( 'Initializing date...' )

		today_date = date.today( )
		today_year = today_date.year
		today_month = today_date.month
		today_day = today_date.day

		self.set_current_datetime( datetime( year = today_year, month = today_month, day = today_day ) )
		self.log( 'Date initialized as: {}'.format( self._current_datetime ) )

		self.log_main( 'Initializing date... done!' )

	def _get_caller( self ):
		return inspect.stack( )[ 2 ][ 3 ]

	def lock_current_datetime( self ):
		caller = self._get_caller( )
		self.log_debug( 'LOCKING DATETIME... (by {})'.format( caller ) )
		self._current_datetime_lock.acquire( )

	def unlock_current_datetime( self ):
		caller = self._get_caller( )
		self.log_debug( 'UNLOCKING DATETIME... (by {})'.format( caller ) )
		self._current_datetime_lock.release( )

	def lock_current_step( self ):
		caller = self._get_caller( )
		self.log_debug( 'LOCKING STEP... (by {})'.format( caller ) )
		self._current_step_lock.acquire( )

	def unlock_current_step( self ):
		caller = self._get_caller( )
		self.log_debug( 'UNLOCKING STEP... (by {})'.format( caller ) )
		self._current_step_lock.release( )		

	def acquire_charging_plugs_semaphore( self ):
		caller = self._get_caller( )		
		self.log_debug( 'ACQUIRING CHARGING PLUGS SEMAPHORE... (by {})'.format( caller ) )		
		self._charging_plugs_semaphore.acquire( )

	def release_charging_plugs_semaphore( self ):
		caller = self._get_caller( )			
		self.log_debug( 'RELEASING CHARGING PLUGS SEMAPHORE... (by {})'.format( caller ) )		
		self._charging_plugs_semaphore.release( )

	def get_current_datetime( self ):
		return self._current_datetime

	def set_current_datetime( self, new_datetime ):
		self._current_datetime = new_datetime

	def _begin_simulation( self ):
		self.log_main( 'Simulating...' )

		sim_sampling_rate = self.get_config( 'sim_sampling_rate' )		
		number_of_steps = self.get_config( 'number_of_steps' )

		while True:

			cars_in_travel = [ ]
			cars_in_charging = [ ]
			total_plug_consumption = 0

			for c in self._cars:

				c.lock( )

				if c.is_traveling( ):
					cars_in_travel.append( c )
				if c.is_charging( ):
					cars_in_charging.append( c )

				plug_consumption = c.get_plug_consumption( )
				total_plug_consumption += plug_consumption

				c.unlock( )

			self.log( '### TOTAL PLUG CONSUMPTION: {} KW ###'.format( total_plug_consumption ) )

			current_step = self.get_current_step( )
			is_simulation_running = ( current_step <= number_of_steps or len( cars_in_travel ) > 0 or len( cars_in_charging ) > 0 )

			if is_simulation_running:	

				self.log( "> Simulation step..." )		

				self.lock_current_datetime( )

				current_datetime = self.get_current_datetime( )
				if current_step > 1:
					
					minutes_per_sim_step = self.get_config( 'minutes_per_sim_step' )
					current_datetime += timedelta( minutes = minutes_per_sim_step )
					self.set_current_datetime( current_datetime )	

				self.unlock_current_datetime( )
				
				self.log( "( ( ( Step #{} - at: {} ) ) )".format( current_step, current_datetime ) )						

				self.on_step( current_datetime )

				self.lock_current_step( )
				
				current_step += 1
				self.set_current_step( current_step )			

				self.unlock_current_step( )

				self.log( '< Simulation step... done!' )							

			else:

				break

			time.sleep( sim_sampling_rate / 1000 )				

		self.log_main( 'Simulating... done!' )	

	def can_simulate_new_actions( self ):
		number_of_steps = self.get_config( 'number_of_steps' )
		can_simulate_new_actions = ( self._current_step <= number_of_steps )
		return can_simulate_new_actions

	def get_current_step( self ):
		return self._current_step

	def set_current_step( self, new_step ):
		self._current_step = new_step

	def on_step( self, current_datetime ):

		if self.can_simulate_new_actions( ):

			current_datetime_str = current_datetime.strftime( '%Y%m%d%H' )

			if current_datetime_str in self._affluence_counts:

				pass
			
			else:

				current_hour_of_day = current_datetime.hour
				affluence_url = "travel/affluence/{}".format( current_hour_of_day )
				affluence_res = self.fetch_gateway( affluence_url )
				affluence = int( affluence_res[ 'affluence' ] )
				self._affluence_counts[ current_datetime_str ] = affluence			

			if self._affluence_counts[ current_datetime_str ] > 0:		

				for c in self._cars:

					c.lock( )

					car_can_travel = ( not c.is_traveling( ) and not c.is_charging( ) )		
					if car_can_travel:
						c.start_travel( )	
						self._affluence_counts[ current_datetime_str ] -= 1	

					c.unlock( )

					if self._affluence_counts[ current_datetime_str ] < 1:
						
						break					

		else:
			
			self.log( '-- Simulation period ended: this step is only used to resume travels and/or charging periods! --' )

	def fetch_gateway( self, endpoint ):
		url = Simulator.GATEWAY_REQUEST_BASE.format( endpoint )
		response = requests.get( url )
		response_json = response.json( )
		self.log_debug( '\\\\\\ GATEWAY \\\\\\ URL: {}'.format( url )	 )
		self.log_debug( '\\\\\\ GATEWAY \\\\\\ RESPONSE: {}'.format( response_json ) )

		return response_json

