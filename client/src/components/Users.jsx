import { useState, useEffect } from 'react'

export default function Users({auth}){
    console.log(auth)
    const [users, setUsers] = useState([]);
    useEffect(()=> {
        const fetchUsers= async()=> {
          const response = await fetch('/api/users');
          const json = await response.json();
          if(response.ok){
           setUsers(json)
          }
          else{
            console.error(json.error)           
          }
        };
        fetchUsers();
      }, []);
    

    return (
        <>
         {auth.is_admin && 
            <div className='users'>
                <div>
                    <div>First Name</div>
                    <div>Last Name</div>
                    <div>Email</div>
                    <div>Phone</div>
                </div>
                
                <ul>
                    {
                        users.map(user =>{
                            return <li key={user.id}>
                                <div>{user.firstname}</div>  
                                <div>{user.lastname}</div>     
                                <div>{user.email}</div>     
                                <div>{user.phone}</div>                               
                            </li>
                        })
                    }
                </ul>
            
            </div>
        }
        </>
    )
}