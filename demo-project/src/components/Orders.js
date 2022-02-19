import React, { Fragment, useEffect, useContext } from 'react'
import MaterialTable from 'material-table'
import UserContext from '../state/UserContext'

const columns = [
    {title: '#', field: 'id', type: 'numeric'},
    {title: 'Customer', field: 'customer'},
    {title: 'Address', field: 'address'}
]

const dummyData =[ 
{id: 1, name: 'Colin But', dob: '', email: 'colin.but1@gmail.com', address: '78 RockingFeller Street, Paris'},
{id: 2, name: 'Amy Man', dob: '', email: 'amy.but1@gmail.com', address: 'Banglow number 55, Neemuch'},
{id: 3, name: 'Daniel But', dob: '', email: 'daniel.but1@yahoo.co.uk', address: 'Pipliya Mandi'},
{id: 4, name: 'Martin Man', dob: '', email: 'martin.man@hotmail.com', address: 'Malhargarh'}
]
let ordersData = [

]

const Orders = () => {
    const userContext = useContext(UserContext)
    
    useEffect(() => {
        ordersData = []
        fetch(process.env.REACT_APP_ORDER_SERVICE + "/orders/list", {
            method: 'GET',
            // headers: {
            //     'Authorization': 'Bearer ' + userContext.auth.jwtToken
            // }    
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error('Failed to fetch orders data from server')
        })
        .then(data => {
            console.log("Data:", data)
            for (let i = 0; i < data.length; i++){
                //console.log("Making request to fetch customer data for: " + data[i].customerId)
                fetch(process.env.REACT_APP_CUSTOMER_SERVICE + "/customer/" + data[i].customerId, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + userContext.auth.jwtToken
                    }
                })
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error('Failed to fetch customer data from server')
                })
                .then(customerData => {
                    //console.log("Customer data:", customerData)
                    let address = customerData.address
                    ordersData.push({
                        id: data[i].id,
                        customer: customerData.firstName + " " + customerData.lastName + ", " + customerData.dateOfBirth + ", " + customerData.email,
                        address: address.houseFlatNo + " " + address.addressLine1 + ", " + address.postCode + ", " + address.city
                    })
                })
                .catch(error => {
                    console.error('Error...')
                })
            }
        })
        .catch(error => {
            ordersData = dummyData
        })
    }, [])

    return (
        <Fragment>
            <div style={{maxWidth:'100%'}}>
                <MaterialTable title="Orders" columns={columns} data={ordersData} />
            </div>
        </Fragment>
    )
}

export default Orders