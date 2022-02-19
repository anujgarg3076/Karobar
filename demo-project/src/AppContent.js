import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Customers from './components/Customers'
import  CustomerForm  from './components/forms/CustomerForm'
import Orders from './components/Orders'
import Items from './components/Items'
import ItemForm from './components/forms/ItemForm'
import About from './components/About'
import Customer from './components/Customer'
import OrderForm from './components/forms/OrderForm'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar
    }
}))

const AppContent = () => {
    const classes = useStyles()
    return (
        <main className={classes.content}>
            <div className={classes.toolbar}/>
            <Routes>
                <Route path="/customers/:customerId" element={<Customer/>} />
                <Route path="/customers" element={<Customers/>} />
                <Route path="/customer-form" element={<CustomerForm/>} />
                <Route path="/orders" element={<Orders/>} />
                <Route path="/order-form" element={<OrderForm/>} />
                <Route path="/items" element={Items} />
                <Route path="/item-form" element={ItemForm} />
                <Route path="/about" element={<About/>} />
                <Route exact path="/">
                
                </Route>
            </Routes>
        </main>
    )
}

export default AppContent