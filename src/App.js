import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'
import { type } from '@testing-library/user-event/dist/type';

// get list from the local storage
const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if(list) {
    return JSON.parse(localStorage.getItem('list'))
  }
    else {return [];}
}

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] =useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({show: false, msg: '', type: ''})

  // onSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('submitted');
    if(!name) {
      // display alert
      showAlert(true, 'danger', 'please enter a value');
    } else if (name && isEditing) {
      // edit
      setList(list.map((item) => {
        if (item.id === editId) {
          return {...item, title: name}
        }
        return item
      }))
      setName('');
      setEditId(null);
      setIsEditing(false);
      showAlert(true, 'success', 'item name changed')
    } else {
      // show alert
      showAlert(true, 'success', 'item added')
      // add item to my list of items
      const newItem = {id: new Date().getTime().toString(), title: name};
      setList([...list, newItem]);
      setName('');
    }
  }
    
// show alert function
  const showAlert = (show = false, type= '', msg= '') => {
    setAlert({show, type, msg})
  }

  // clear list function
  const clearList = () => {
    showAlert(true, 'danger', 'list deletd');
    setList([]);
  }

  // delete single item from the list
  const deleteItem = (id) => {
    showAlert(true, 'danger', 'item deleted');
    setList(list.filter((item) => item.id !== id))
  }

  // edit item name
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  }

// set Item to local storage
  useEffect (() => {
    localStorage.setItem('list', JSON.stringify(list))
  },[list])

  return <section className='section-center'>
    <form className='grocery-form' onSubmit={handleSubmit}>

      {alert.show  && <Alert {...alert} removeAlert = {showAlert} list ={list} />}

      <h3>Grocery Bud</h3>
      <div className="form-control">
        <input type="text" className='grocery' 
          placeholder='e.g Eggs' 
          value={name} 
          onChange = {(e) => setName(e.target.value)} 
        />
        <button type="submit" className='submit-btn'>{isEditing? 'edit' : 'submit'}</button>
      </div>
    </form>
      {
      list.length > 0 && 
      <div className="grocery-container">
      <List items = {list} removeItem = {deleteItem}  editItem = {editItem}/>
      <button className='clear-btn' onClick={clearList}>clear items</button>
    </div> 
    }
  
  </section>
}

export default App
