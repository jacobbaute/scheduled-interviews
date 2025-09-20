import { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import './InterviewSchedule.css'
import "react-datepicker/dist/react-datepicker.css";

function InterviewSchedule() {
  const [startDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [interviews, setInterviews] = useState([]);
  const [numberOfInterviews, setNumberOfInterviews] = useState(0);
  const [error, setError] = useState(false)

  const getInterviews = async (dateToCheck) => {
    fetch('https://localhost:7165/api/CheckInterviews', {
        method: 'POST',
        body: JSON.stringify({
        dateOfInterview: dateToCheck
      }),
        headers: {
        'Content-type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((data) => {
      setNumberOfInterviews(data.numberOfInterviews);
      setInterviews(data.interviews);
      setError(false);
    })
    .catch((err) => {
      setError(true);
      console.log(err.message);
    });
  };

  const listInterviews = () => {
    if(error) {
      return <div><p className="error">An error has occurred while retrieving scheduled interviews.</p></div>
    }
    var elements = [<div>
        <p>
          There are {numberOfInterviews} interviews scheduled on {selectedDate}
        </p>
      </div>];
    if(interviews.length > 0) {
      elements.push(<div>{interviews.map(interview => (<p>{interview.name}</p>))}</div>);
      return elements;
    }
    else {
      return elements;
    }
  };

  useEffect(() => {
    setSelectedDate(startDate.toDateString());
    getInterviews(startDate.toISOString());
  }, []);

  return (
    <>
      <h1>Interview Schedule Assistant</h1>
      <h2>Select a date to continue:</h2>
      <DatePicker selected={startDate} onChange={(date) => {
        setSelectedDate(date.toDateString());
        getInterviews(date.toISOString());
      }} />
      <div>{listInterviews()}</div>
    </>
  )
}

export default InterviewSchedule
