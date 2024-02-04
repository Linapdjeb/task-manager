import React, { Component } from 'react'
import Modal from "./components/Modal";
import axios from 'axios';  



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false
      },
      taskList: [],
    };
  }

  // Add componentDidMount()
  componentDidMount() {
    this.refreshList();
  }
  

  refreshList = () => {
    axios   //Axios to send and receive HTTP requests
      .get("http://localhost:8000/api/tasks/")
      .then(res => this.setState({ taskList: res.data }))
      .catch(err => console.log(err));
  };


  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span onClick={() => this.displayCompleted(true)} className={this.state.viewCompleted ? "active" : ""}>completed</span>
        <span onClick={() => this.displayCompleted(false)} className={this.state.viewCompleted ? "" : "active"}>Incompleted</span>
      </div>
    )
  };

  // rendering items from the list (comp or incomp)
  renderItems = () => {
    const {viewCompleted} = this.state
    const newItems = this.state.taskList.filter(
      item => item.completed === viewCompleted
    )

    return newItems.map(item => (
     <li key={item.id} className='list-group-item justify-content-between align-items-center'>
        <span className={`task-title mr-2 ${this.state.viewCompleted ? "completed-task" : "" }`} title={item.description} >{ item.title }</span>
        <span>
          <button onClick={() => this.editItem(item)} className='btn btn-secondary mr-2'>Edit</button>
          <button onClick={() => this.handleDelete(item)} className='btn btn-danger'>Delete</button>
        </span>
     </li>
    ))
  };


  ///// add this after modal creation
  // create toggle
  toggle = () => {
    this.setState({ modal: !this.state.modal })
  };

  handleSubmit = item => {
    this.toggle()
    if (item.id) {
      // if old post to edit and submit
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    // if new post to submit
    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then(res => this.refreshList());
  };

  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(res => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  //Edit item
  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };



  render() {
    return (

      <main className='content p-3 nb-2 bg-info'> 
        <h1 className='text-black text-uppercase text-center my-4'>Task Manager</h1>
        <div className='row'>
          <div className='col-md-6 col-sma-10 mx-auto p-0'>
            <div className='card p-3'>
              <div className="">
                  <button onClick={this.createItem} className="btn btn-dark">Add task</button>
              </div>
              {this.renderTabList()}
              <ul className='list-group list-group-flush'>
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
        <Modal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
        ) : null}
        <footer className='my-3 mb-2 bg-info text-white text-center'>
          Copyright 2021 &copy; lee
        </footer>
      </main>
    )
  }
}




// function App() {
//   return (
//     <div className="App">
//       Hello!
//     </div>
//   );
// }

export default App;
