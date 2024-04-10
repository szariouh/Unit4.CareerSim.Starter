export default function Account({auth}){
    

        return (
            <>
            {
                <div>
                <h3>Account details</h3>
                <ul className="account-details">
                    <li>
                        <div>First Name: </div>
                        <div>{auth.firstname}</div>
                    </li>
                    <li>
                        <div>Last Name: </div>
                        <div>{auth.lastname}</div>
                    </li>
                    <li>
                        <div>Email: </div>
                        <div>{auth.email}</div>
                    </li>
                    <li>
                        <div>Phone: </div>
                        <div>{auth.phone}</div>
                    </li>
                </ul>
            </div>
            }
            </>
        )
    }