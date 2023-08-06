import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AdminAdd from './AdminAdd'


const AdminHome = () => {
  const [data, setData] = useState([]);
  const [updation, setUpdation] = useState(false);
  const [singleval, setSingleval] = useState([]);
  const [userToken, setUserToken] = useState(sessionStorage.getItem("userToken"))
  const [userRole, setUserrole] = useState(sessionStorage.getItem("userRole"));
  

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const pageSize = 5;//Number of item per page

  const fetchDatafromAPI = (pageNumber) => {
    return axios
      .get("http://localhost:5000/api/getudata/" +userToken,+userRole)
      .then((response) => {
        console.log("data from get", response.data);
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = response.data.slice(startIndex, endIndex);
        setData(paginatedData);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      })
      .catch(err => console.log(err));
  }

  const updateUser = (val) => {
    setUpdation(true);
    setSingleval(val);
  }

  const deleteUser = (id) => {
    axios.delete(`http://localhost:5000/api/deludata/${id}`)
      .then((response) => {
        if (response.data.message === "Deleted successfully") {
          alert(response.data.message);
          fetchDatafromAPI(currentPage);
        }
        else {
          alert(response.data.message);
        }
      })
      .catch((err) => { console.log(err) })
  }

  useEffect(() => {
    fetchDatafromAPI(currentPage)
      .then(() => setLoading(false)) // Set loading to false after the API call finishes
      .catch((error) => console.log(error)); // Handle any errors during the API call
  }, [currentPage]);

  useEffect(() => {
    fetchDatafromAPI(currentPage);
  }, [currentPage]);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  let finalJSX =
    <div className="container w-75 mt-4 pt-4">
      <Link to="/aadd">
        <Button variant="success" className="mb-3">
          <ion-icon name="person-add-outline" size="large"></ion-icon>
        </Button>
      </Link>
      {loading ?
        (<p>Loading data..</p>
        ) :
        data && data.length > 0 ? ( // Check if data is not undefined and has some elements
          <>
            <Table responsive  bordered hover>
              <thead>
                <tr class="table-success">
                  <th>Name</th>
                  <th>Email ID</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {data.map((value, index) => {
                  return <tr>
                    <td>{value.name}</td>
                    <td>{value.email}</td>
                    <td>{value.username}</td>
                    <td>{value.password}</td>
                    <td>{value.role}</td>
                    <td><Button className="btn btn-success" onClick={() => updateUser(value)}><ion-icon name="create"></ion-icon></Button></td>
                    <td><Button className="btn btn-danger" onClick={() => deleteUser(value._id)}><ion-icon name="close-circle"></ion-icon></Button></td>
                  </tr>
                })}
              </tbody>
            </Table>
            <div className='d-flex justify-content-center'>
              <Pagination>
                <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
                {[...Array(totalPages).keys()].map((pageNumber) => (
                  <Pagination.Item
                    key={pageNumber}
                    active={pageNumber + 1 === currentPage}
                    onClick={() => handlePagination(pageNumber + 1)}
                  >
                    {pageNumber + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
              </Pagination>

            </div>
          </>
        ) : (<p>No data available...</p>)}
    </div>
  if (updation) finalJSX = <AdminAdd method='put' data={singleval} />
  return (
    finalJSX
  )
}

export default AdminHome