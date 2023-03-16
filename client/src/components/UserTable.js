import React from 'react'

function UserTable({ userList, handleDelete, handleEdit, handleDeleteAll }) {

    return (
        <div style={{ marginBottom: '160px' }}>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Age</th>
                        <th scope="col">Email</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((item, index) => <tr key={item._id}>
                        <td><strong>{index + 1}</strong></td>
                        <td>{item.name}</td>
                        <td>{item.age}</td>
                        <td>{item.email} </td>

                        <td>
                            <button onClick={() => handleDelete(item._id)} className="btn btn-danger me-1"><i className="bi bi-trash"></i></button>

                            <button onClick={() => { handleEdit(item._id); }} className="btn btn-info"><i class="bi bi-pencil-square"></i></button>
                        </td>
                    </tr>)}

                </tbody>
            </table>
            <button className="btn btn-warning" onClick={() => { handleDeleteAll() }}>Delete All Users</button>
        </div>
    )
}

export default UserTable