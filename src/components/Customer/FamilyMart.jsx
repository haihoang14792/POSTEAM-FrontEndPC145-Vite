import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { fetchFamilyMart } from "../../services/strapiServices.jsx";
import "./allCustomer.scss";

const FamilyMart = (props) => {
  const [Familymart, setFamilymart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Số lượng phần tử trên mỗi trang

  useEffect(() => {
    const loadFamilymart = async () => {
      try {
        const familymartsData = await fetchFamilyMart();
        setFamilymart(familymartsData.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    loadFamilymart();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const totalPages = Math.ceil(Familymart.length / itemsPerPage);
  const currentPageData = Familymart.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className="mt-3">Danh sách khách hàng</h2>
      <hr />
      <div className="container">
        <>
          <table className="table table-bordered table-hover mt-2">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Store Number</th>
                <th scope="col">Address</th>
                <th scope="col">City</th>
                <th scope="col">Phone</th>
                <th scope="col">Opening</th>
                <th scope="col">Close</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((store) => (
                <tr key={store.id}>
                  <td>{store.id}</td>
                  <td>{store.attributes.StoreNumber}</td>
                  <td>{store.attributes.Address}</td>
                  <td>{store.attributes.City}</td>
                  <td>{store.attributes.Phone}</td>
                  <td>{store.attributes.Opening}</td>
                  <td>{store.attributes.Close}</td>
                  <td>{store.attributes.Status ? "Mở" : "Đóng"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
        {totalPages > 0 && (
          <div className="user-footer">
            <ReactPaginate
              nextLabel="Tiếp >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPages}
              previousLabel="< Trước"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyMart;
