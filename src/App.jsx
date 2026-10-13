import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './page/Dashboard'
import DashboardLayout from './layout/DashboardLayout'
import Contact from './page/Contact'
import ProductDetail from './page/Productdetail'
import Addproducts from './page/add_product'
import ProductPage from './page/products'
import Signup from './page/signup'
import Login from './page/login'
import Forget from './page/forget_pass'
import Reset from './page/reset'
import Otp from './page/otp'


const App = () => {
   return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="contact" element={<Contact />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="add-Product" element={<Addproducts />} />
        <Route path="Products" element={<ProductPage />} />
        <Route path="/dashboard/login" element={<Login />} />
        <Route path="/dashboard/Signup" element={<Signup />} />
        <Route path="/dashboard/Forget-Password" element={<Forget />} />
        <Route path="/dashboard/Reset" element={<Reset />} />
        <Route path="/dashboard/Otp" element={<Otp />} />
      </Route>
    </Routes>
  )
}

export default App