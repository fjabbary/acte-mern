import React, { useState, useEffect } from 'react'
import UserTable from './UserTable';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';
import Axios from 'axios';

function UserForm() {

    const [contact, setContact] = useState({ name: "", age: "", email: "", relocated: false });
    const [userList, setUserList] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(null)
    const [errors, setErrors] = useState({ name: "", age: "", email: "" })
    const [validEmail, setValidEmail] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const handleChange = (e) => {
        setContact({ id: uuidv4(), ...contact, [e.target.name]: e.target.value })
    }

    const handleChangeCheckbox = (e) => {
        setContact({ ...contact, relocated: e.target.checked })
    }

    const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const validateEmail = (e) => {
        if (e.target?.value && e.target.value.match(isValidEmail)) {
            setValidEmail(true);
        } else {
            setValidEmail(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({ name: "", age: "", email: "" })

        const words = contact.name.split(' ')
        const numOfWords = words.length;
        const isWordEligible = words.map(word => word.length >= 3 && word.length <= 5).includes(false) ? false : true;

        if (!contact.name) {
            setErrors({ name: "Please enter a valid name" })
            return;
        }

        if (numOfWords !== 4) {
            setErrors({ name: "Name has to have 4 words" })
            return;
        }

        if (!isWordEligible) {
            setErrors({ name: "Each word has to have between 3 and 5 characters" })
            return;
        }

        if (!contact.age) {
            setErrors({ age: "Please enter a valid age" })
            return;
        }

        if (contact.age < 18 || contact.age > 45) {
            setErrors({ age: "Age input must be between 18 to 45" })
            return;
        }

        if (!Number.isInteger(Number(contact.age))) {
            setErrors({ age: "Age has to be integer number" })
            return;
        }

        if (!contact.email) {
            setErrors({ email: "Please enter an email" })
            return;
        }

        if (!validEmail) {
            setErrors({ email: "Please enter an email with valid format" })
            return;
        }


        Axios.post("http://localhost:3001/api/user", {
            name: contact.name,
            age: contact.age,
            email: contact.email
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(newUser => {
            setUserList([...userList, newUser.data])
        })

        setContact({ name: "", age: "", email: "", relodcated: false })
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/api/users")
            .then(users => {
                setUserList(users.data)
            })
    }, [userList])

    const handleDelete = async (id) => {
        await Axios.delete(`http://localhost:3001/api/user/${id}`)

        const filteredArr = userList.filter(item => item._id !== id)
        setUserList(filteredArr)
    }

    const handleEdit = (id) => {
        const foundItem = userList.find(item => item._id === id)
        const { name, age, email } = foundItem;
        setContact({ name, age, email, relodcated: false })
        setIsUpdate(true)
        setUpdateId(id)
        setShowForm(true)
        setErrors({ name: "", age: "", email: "" })
    }

    const handleUpdate = async () => {
        Axios.put(`http://localhost:3001/api/user/${updateId}`, contact)

        setIsUpdate(false)
        setContact({ name: "", age: "", email: "", relodcated: false })
        setShowForm(false)
    }

    const handleDeleteAll = () => {
        Axios.delete("http://localhost:3001/api/users")
            .then(() => {
                setUserList([])
            })
    }

    const handleExpand = () => {
        setShowForm(!showForm)
    }

    const errorNameClass = classnames({
        'form-control': true,
        'border-error': errors.name
    })

    const errorAgeClass = classnames({
        'form-control': true,
        'border-error': errors.age
    })

    const errorEmailClass = classnames({
        'form-control': true,
        'border-error': errors.email
    })

    return (
        <React.Fragment>
            <div className="user-form m-auto mt-5 p-5">
                <h1>Enter new user <i className={showForm ? "bi bi-node-minus-fill" : "bi bi-node-plus-fill"} style={{ float: 'right' }} onClick={handleExpand}></i></h1>
                {showForm && <div>
                    <form className=" p-5 text-dark mb-3" >
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className={errorNameClass} id="name" name="name" onChange={handleChange} value={contact.name} />
                            <small><p className='text-danger'>{errors.name}</p></small>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="age" className="form-label">Age</label>
                            <input type="number" className={errorAgeClass} id="age" name="age" onChange={handleChange} value={contact.age} />
                            <small><p className='text-danger'>{errors.age}</p></small>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className={errorEmailClass} id="email" name="email" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" onChange={handleChange} value={contact.email} onKeyUp={validateEmail} />
                            <small><p className='text-danger'>{errors.email}</p></small>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="relocated" onChange={handleChangeCheckbox} name="relocated" value={contact.relocated} />
                            <label className="form-check-label" htmlFor="relocated">Relocated</label>
                        </div>
                    </form>
                    {!isUpdate && <button type="submit" className="btn btn-dark" onClick={handleSubmit}>Submit</button>}

                    {isUpdate && <button onClick={handleUpdate} className="btn btn-success">Update</button>}
                </div>}
            </div>

            <hr className='my-5' />
            <UserTable userList={userList} handleDelete={handleDelete} handleEdit={handleEdit} handleUpdate={handleUpdate} handleDeleteAll={handleDeleteAll} />
        </React.Fragment>
    )
}

export default UserForm