import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import axios from 'axios'

const formSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
  tos: yup.boolean().oneOf([true], "TOS is required")
})

function Form({ users }) {
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '',
    tos: false
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    tos: false
  })

  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [postReq, setPostReq] = useState([])

  useEffect(() => {
    formSchema.isValid(formValue).then(valid => {
      setButtonDisabled(!valid)
    })
  }, [formValue])

  const validateChange = e => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.name === "tos" ? e.target.checked : e.target.value)
      .then(valid => {
        setErrors({
          ...errors, [e.target.name]: ""
        })
      })
      .catch(err => {
        setErrors({
          ...errors, [e.target.name]: err.errors[0]
        })
      })
  }

  const onInputChange = e => {
    e.persist()
    const newData = {
      ...formValue, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
    }
    validateChange(e)
    setFormValue(newData)
  }

  const onFormSubmit = e => {
    e.preventDefault()
    axios.post('https://reqres.in/api/users', formValue)
    .then(res => {
      setPostReq(res)
      users.push(formValue)

      setFormValue({
        name: '',
        email: '',
        password: '',
        terms: ''
      })
    })
    .catch(error => console.log(error.res))
  }

  return (
    <div>
    <form onSubmit={onFormSubmit}>
      <label htmlFor="name">Name: 
        <input name="name" value={formValue.name} onChange={onInputChange}></input>
        {errors.name.length > 0 ? <p>{errors.name}</p> : null}
      </label>
      <br />
      <label htmlFor="email">Email: 
        <input name="email" value={formValue.email} onChange={onInputChange}></input>
        {errors.email.length > 0 ? <p>{errors.email}</p> : null}
      </label>
      <br />
      <label htmlFor="password">Password:
        <input type="password" name="password" value={formValue.password} onChange={onInputChange}></input>
        {errors.password.length > 0 ? <p>{errors.password}</p> : null}
      </label>
      <br />
      <label htmlFor="tos">
        Terms of Service: <input type="checkbox" name="tos" checked={formValue.tos} onChange={onInputChange}></input>
        {errors.tos.length > 0 ? <p>{errors.tos}</p> : null}
      </label>
      <pre>{JSON.stringify(postReq.data, null, 2)}</pre>
      <br />
      <button name="submit-btn" disabled={buttonDisabled}>Submit</button>
    </form>

    {users.map(user => {
        return (
          <ul>
            <li>{user.name}</li>
            <li>{user.email}</li>
          </ul>
        )
      })}
  </div>  
  )
}

export default Form