import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [job, setJob] = useState('')
  const [jobDate, setJobDate] = useState(new Date().toISOString().split('T')[0]);
  const inputRef = useRef(null)
  const today = new Date().toISOString().split('T')[0]
  const date = today.split('-')
  const dateTitle = `${date[2]}-${date[1]}-${date[0]}`

  const [jobs, setJobs] = useState(() => {
    const jobStorage = JSON.parse(localStorage.getItem('jobs')) ?? []

    const validJobs = jobStorage.filter(item => item.date >= today)
    if (validJobs.length < jobStorage.length) {
      localStorage.setItem('jobs', JSON.stringify(validJobs));
    }

    return validJobs
  })

  function handleSubmit(e) {
    setJob(e.target.value)
  }

  function handleSubmitDate(e) {
    setJobDate(e.target.value)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  function handleAdd() {
    if (job.trim() === '') {
      alert('Vui lòng nhập đủ')
      return
    }
    
    setJobs(prev => {
      const newJobObj = {date: jobDate, job: job}
      const newJobs = [...prev, newJobObj]
      const jsonJob = JSON.stringify(newJobs)

      localStorage.setItem('jobs', jsonJob)

      return newJobs
    })

    setJob('')
    inputRef.current.focus()
  }

  function handleDelete(index) {
    setJobs(prev => {
      const newJobs = prev.filter(function(_, i) {
        return i !== index
      })

      localStorage.setItem('jobs', JSON.stringify(newJobs))

      return newJobs
    })
  }

  const todayJobs = jobs.filter(item => item.date === today);

  return (
    <div className="container">
      <div className="todo-box">
        <h2 className="title">Daily Tasks {dateTitle}</h2>
        
        <div className="input-group">
          <input 
            value={job} 
            ref={inputRef}
            onChange={handleSubmit}
            onKeyDown={handleKeyDown}
            placeholder="Việc cần làm..."
          />
          <input
            type="Date"
            value={jobDate}
            onChange={handleSubmitDate}
            onKeyDown={handleKeyDown}
          />
          <button className="add-button" onClick={handleAdd}>Thêm</button>
        </div>

        <ul className="job-list">
          {jobs.map((item, index) => {
            if (item.date === today) {
              return (
                <li key={index} className="job-item">
                  <span className="job-text">{item.job}</span>
                  <button 
                    className="delete-button" 
                    onClick={() => handleDelete(index)}
                  >
                    ✕
                  </button>
                </li>
              );
            }
            return null
          })}
        </ul>

        {todayJobs.length === 0 && <p className="empty-text">Hôm nay không có việc gì cả!</p>}
      </div>
    </div>
  );
}

export default App;
