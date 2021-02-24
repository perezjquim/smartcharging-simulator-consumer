import time
import threading
import inspect
from datetime import timedelta
from .Travel import Travel
from .ChargingPeriod import ChargingPeriod

class Car:

	LOG_TEMPLATE = '»»»»»»»»»» Car #{} --- {}'

	DEFAULT_BATTERY_LEVEL = 10

	counter = 0

	_id = 0
	_simulator = None
	_is_traveling = False
	_is_charging = False
	_travels = [ ]
	_charging_periods = [ ]
	_battery_level = 0
	_lock = None
	_plug_consumption = 0

	def __init__( self, simulator ):
		Car.counter += 1				
		self._id = Car.counter
		self._simulator = simulator
		self._is_traveling = False
		self._is_charging = False
		self._travels = [ ]	
		self._charging_periods = [ ]
		self._battery_level = Car.DEFAULT_BATTERY_LEVEL		
		self._lock = threading.Lock( )
		self._plug_consumption = 0

	def get_simulator( self ):
		return self._simulator

	def lock( self ):
		caller = inspect.stack()[1][3]
		self.log_debug( 'LOCKING... (by {})'.format( caller ) )
		self._lock.acquire( )

	def unlock( self ):
		caller = inspect.stack()[1][3]
		self.log_debug( 'UNLOCKING... (by {})'.format( caller ) )
		self._lock.release( )

	def is_traveling( self ):
		return self._is_traveling

	def is_charging( self ):
		return self._is_charging

	def set_charging_state( self, new_charging_state ):
		self._is_charging = new_charging_state

	def set_traveling_state( self, new_traveling_state ):
		self._is_traveling = new_traveling_state			

	def get_travels( self ):
		return self._travels

	def get_charging_periods( self ):
		return self._charging_periods

	def get_battery_level( self ):
		return self._battery_level

	def set_battery_level( self, battery_level ):
		if battery_level >= 0 and battery_level <= 10:
			self._battery_level = battery_level
		elif battery_level < 0:
			self._battery_level = 0
		elif battery_level > 10:
			self._battery_level = 10
		else:
			self.log( 'Invalid battery level given!' )

	def start_travel( self ):	

		if self.is_traveling( ) or self.is_charging( ):

			self.log( 'Invalid state to start a new travel!' )

		else:

			new_travel = Travel( self )
			self._travels.append( new_travel )
			self.set_traveling_state( True )

	def end_travel( self ):

		self.lock( )		

		if self.is_traveling( ):

			self.set_traveling_state( False )
			last_travel = self._travels[ -1 ]
			last_travel_battery_consumption = last_travel.get_battery_consumption( )
			battery_level = self.get_battery_level( )
			new_battery_level = battery_level - last_travel_battery_consumption
			self.set_battery_level( new_battery_level )

			self.log( 'Travel ended!' )			

			simulator = self._simulator
			simulator.lock_current_step( )

			if simulator.can_simulate_new_actions( ):

				if new_battery_level > 2:

					pass

				else:

					self.log( 'Car reached <20% battery! Waiting for a available charging plug..' )										
					self._start_charging_period( )																			

			simulator.unlock_current_step( )																

		else:

			self.log( 'Car was not traveling, yet an attempt to end a travel was made (??)' )				

		self.unlock( )				

	def _start_charging_period( self ):

		if self.is_traveling( ) or self.is_charging( ):

			self.log( 'Invalid state to start a new charging period!' )

		else:

			new_charging_period = ChargingPeriod( self )
			self._charging_periods.append( new_charging_period )
			self.set_charging_state( True )

	def end_charging_period( self ):

		self.lock( )	

		if self.is_charging( ):

			self.set_charging_state( False )	
			self.set_plug_consumption( 0 )

			self.log( 'Charging period ended!' )

			simulator = self._simulator
			simulator.release_charging_plugs_semaphore( )

		else:

			self.log( 'Car was not charging, yet an attempt to end a charging period was made (??)' )

		self.unlock( )	

	def get_plug_consumption( self ):

		return self._plug_consumption

	def set_plug_consumption( self, new_plug_consumption ):
		self._plug_consumption = new_plug_consumption	

	def log( self, message ):
		self._simulator.log( Car.LOG_TEMPLATE.format( self._id, message ) )

	def log_debug( self, message ):
		self._simulator.log_debug( Car.LOG_TEMPLATE.format( self._id, message ) )		