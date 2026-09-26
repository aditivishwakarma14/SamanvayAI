import React from 'react'

async function logOut() {

    try{
    
        const data = await api.get("/api/auth/logOut")
        console.log(data)

    }catch(error){
        console.log(error)
    }
    
}

export default logOut