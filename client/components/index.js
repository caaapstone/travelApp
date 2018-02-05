/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Main} from './main'
export {default as UserHome} from './user-home'
export {Login, Signup} from './auth-form'
export {default as UserDashboard} from './userDashboard'
export {default as CalendarBoard} from './calendarBoard'
export {default as MapBoard} from './mapBoard'
export {default as CreateTrip} from './CreateTrip'
export {default as JoinTrip} from './JoinTrip'
export {default as Flights} from './flights'
export {default as Hotels} from './hotels'
export {default as TripDashboard} from './TripDashboard'
export {default as IdeaBoard} from './IdeaBoard'
export {default as TripDetailsSetUp} from './TripDetailsSetUp'
export {default as DraggableActivity} from './draggableActivity'
export {default as DraggableYelpResult} from './draggableYelpResult'
export {default as Itinerary} from './Itinerary'
export {default as ActivityPopUp} from './activityPopUp'
export {default as LandingPage} from './landingPage'

