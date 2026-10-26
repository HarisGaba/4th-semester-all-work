import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
const LandingNavigation = lazy(() => import("./components/landing/LandingNavigation"));
const LandingFooter = lazy(() => import("./components/landing/LandingFooter"));
const EventSphereHome = lazy(() => import("./page/EventSphereHome"));
const Dashboard = lazy(() => import("./page/Dashboard"));
const Contact = lazy(() => import("./page/Contact"));
const Login = lazy(() => import("./page/login"));
const Signup = lazy(() => import("./page/signup"));
const Forget = lazy(() => import("./page/forget_pass"));
const Otp = lazy(() => import("./page/otp"));
const Reset = lazy(() => import("./page/reset"));
const ProductDetail = lazy(() => import("./page/Productdetail"));
const Addproducts = lazy(() => import("./page/add_product"));
const ProductPage = lazy(() => import("./page/products"));
const EventsManagement = lazy(() => import("./page/EventsManagement"));
const ExhibitorsManagement = lazy(() => import("./page/ExhibitorsManagement"));
const AttendeesManagement = lazy(() => import("./page/AttendeesManagement"));
const BoothSelection = lazy(() => import("./page/BoothSelection"));
const SessionsManagement = lazy(() => import("./page/SessionsManagement"));
const NotificationsManagement = lazy(() => import("./page/NotificationsManagement"));
const AnalyticsDashboard = lazy(() => import("./page/AnalyticsDashboard"));
const ExhibitorSearch = lazy(() => import("./page/ExhibitorSearch"));
const FeedbackSupport = lazy(() => import("./page/FeedbackSupport"));
const Messages = lazy(() => import("./page/Messages"));
const FloorPlan = lazy(() => import("./page/FloorPlan"));
const allRoles = ["admin", "organizer", "exhibitor", "attendee"];
function App() {
  return <Suspense fallback={<p role="status" className="p-6 text-center">
          Loading page...
        </p>}>
      <Routes>
        <Route path="/" element={<EventSphereHome />} />
        <Route path="/contact" element={<><LandingNavigation /><Contact /><LandingFooter /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/reset" element={<Reset />} />
        {Object.entries({
        expos: 'events',
        exhibitors: 'exhibitors',
        booths: 'booths',
        schedule: 'sessions',
        registrations: 'attendees',
        bookmarks: 'sessions',
        messages: 'messages',
        notifications: 'notifications',
        feedback: 'feedback',
        analytics: 'analytics'
      }).map(([alias, target]) => <Route key={alias} path={'/dashboard/' + alias} element={<Navigate to={'/' + target} replace />} />)}
        <Route path="/dashboard/login" element={<Login />} />
        <Route path="/dashboard/signup" element={<Signup />} />
        <Route path="/dashboard/forget-password" element={<Forget />} />
        <Route path="/dashboard/otp" element={<Otp />} />
        <Route path="/dashboard/reset" element={<Reset />} />

        <Route element={<ProtectedRoute allowedRoles={allRoles} />}>
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />


          <Route element={<ProtectedRoute allowedRoles={allRoles} />}>
            <Route path="events" element={<EventsManagement />} />
            <Route path="sessions" element={<SessionsManagement />} />
            <Route path="floor-plan" element={<FloorPlan />} />
            <Route path="notifications" element={<NotificationsManagement />} />
            <Route path="exhibitor-search" element={<ExhibitorSearch />} />
            <Route path="feedback" element={<FeedbackSupport />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="products" element={<ProductPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["organizer", "attendee", "exhibitor"]} />}>
            <Route path="messages" element={<Messages />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "organizer", "exhibitor"]} />}>
            <Route path="exhibitors" element={<ExhibitorsManagement />} />
            <Route path="booths" element={<BoothSelection />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "organizer", "attendee"]} />}>
            <Route path="attendees" element={<AttendeesManagement />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "organizer"]} />}>
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="add-product" element={<Addproducts />} />
          </Route>
        </Route>

        </Route>

        <Route path="*" element={<h1 className="p-6">Page not found</h1>} />
      </Routes>
    </Suspense>;
}
export default App;
