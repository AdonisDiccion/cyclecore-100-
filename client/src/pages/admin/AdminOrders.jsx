import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
} from "@mui/material";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { BiPrinter } from "react-icons/bi";
import Search from "../../components/forms/AdminSearchForm";
import { MdOutlineHistoryEdu } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  //context
  const [auth, setAuth] = useAuth();
  //state

  const [status, setStatus] = useState("")

  const statusData = [
    {
      id:1,
      name: "Processing"
    },
    {
      id:2,
      name: "Not Processed"
    },
    {
      id:3,
      name: "Shipped"
    },
    {
      id:4,
      name: "Delivered"
    },
    {
      id:5,
      name: "Cancelled"
    },
  ]
  // const [status, setStatus] = useState([
  //   "Not Processed",
  //   "Processing",
  //   "Shipped",
  //   "Delivered",
  //   "Cancelled",
  // ]);  


  const [orders, setOrders] = useState([]);
  const [changedStatus, setChangedStatus] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);

  const navigate = useNavigate();

  // const { Option } = Select;

  // handleOrderDetailsClick
  const handleOrderDetailsClick = (orders) => {
    setDialogOpen(true);
    setSelectedOrder(orders);
    setSelectedOrderProducts(orders.products);
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/all-orders");
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const componentRef = useRef(null);

  const handleChange = async (orderId, value) => {
    setChangedStatus(value);
    try {
      const { data } = await axios.put(`/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (err) {
      console.log(err);
    }
  };



  console.log(selectedOrder);

  return (
    <>
      <div className={`px-10 py-5 font-bebas bg-gray-200 `}>
        <div className="flex justify-between mb-3">
          <ReactToPrint
            trigger={() => {
              return (
                <button className="flex items-center gap-1 hover:text-orange-500">
                  <BiPrinter fontSize={25} />
                  print order
                </button>
              );
            }}
            content={() => componentRef.current}
            documentTitle="Print Order History"
            pageStyle="print"
          />
        </div>

        <div>
          <Paper>
            <div className="py-2 px-4 border-b bg-white flex justify-between">
              <strong className="text-3xl tracking-wider flex items-center gap-1">
                ORDER HISTORY{" "}
                <MdOutlineHistoryEdu className="text-yellow-500" />
              </strong>

              <Search />
            </div>

            <div className="p-4 bg-white">
              <table
                className="w-[100%] justify-evenly border"
                ref={componentRef}
              >
                <thead className="border-b">
                  <tr className="text-left text-xl tracking-wide bg-gray-100">
                    <th className="p-2">Order Id</th>
                    <th className="p-2">User</th>
                    <th className="p-2">product</th>
                    <th className="p-2">price</th>
                    <th className="p-2">email</th>
                    <th className="p-2">order date</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>

                <tbody>
                  {orders?.map((o, i) => (
                    <>
                      {o?.products?.map((p, i) => (
                        <>
                          <tr key={i} className="border-b">
                            <td className="p-2">{o?.ordernumber}</td>

                            <td className="p-2">
                              {o?.buyer?.lastname},{o?.buyer?.firstname}
                            </td>

                            <td className="p-2">{p.name}</td>

                            <td className="p-2">
                              {p.price.toLocaleString("en-US", {
                                style: "currency",
                                currency: "PHP",
                              })}
                            </td>

                            <td className="p-2">{o?.buyer?.email}</td>

                            <td className="p-2">
                              {moment(o.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss"
                              )}
                            </td>

                            <td className="p-2">
                              <button
                                className="p-1 hover:bg-gray-100"
                                onClick={() => handleOrderDetailsClick(o)}
                              >
                                <BsThreeDotsVertical />
                              </button>
                            </td>
                          </tr>
                        </>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>

               {/* dialog */}
               <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xl">
                  <DialogTitle>
                    <DialogContentText><span className="font-bebas font-bold text-3xl tracking-wider">Order Details</span></DialogContentText>
                  </DialogTitle>

                  
                      <DialogContent>
                      {selectedOrder && (
                        <div className="font-bebas">
                          <table className="border">
                            <thead className="border-b text-xl tracking-wider text-left">
                              <tr>
                                <th className="p-2">Order ID</th>
                                <th className="p-2">USER</th>
                                <th className="p-2">PRODUCT</th>
                                <th className="p-2">PRICE</th>
                                <th className="p-2">EMAIL</th>
                                <th className="p-2">ORDER DATE</th>
                                <th className="p-2">Status</th>
                              </tr>
                            </thead>
                          {selectedOrder?.products?.map((product, index) => (
                            <tbody key={index} className="tracking-wide">
                              <tr className="border-b">
                                <td className="p-2">{selectedOrder.ordernumber}</td>
                                <td className="p-2">{selectedOrder.buyer.lastname}, {selectedOrder.buyer.firstname}</td>
                                <td className="p-2">{product.name}</td>
                                <td className="p-2">{product.price.toLocaleString("en-US", { style: "currency", currency: "PHP" })}</td>
                                <td className="p-2">{selectedOrder.buyer.email}</td>
                                <td className="p-2">{moment(selectedOrder.createdAt).format("MMMM Do YYYY, h:mm:ss")}</td>
                                <td className="p-2 w-[10rem]">
                                  <Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    variant="standard"
                                    fullWidth                                   
                                  >
                                    {statusData.map((s) => (
                                      <MenuItem key={s._id} value={s.name}>
                                        <span className={`font-bebas text-[1.5rem] ${s.name.includes("Processing") ? "text-green-500" : s.name.includes("Not Processed") ? "text-yellow-500" : s.name.includes("Shipped") ? "text-orange-500" : s.name.includes("Delivered") ? "text-blue-500" : s.name.includes("Cancelled") ? "text-red-500" : ""}`}>
                                          {s.name}
                                        </span>
                                      </MenuItem>
                                    ))}                                    
                                  </Select>
                                </td>
                                </tr>                                                            
                            </tbody>
                            ))}
                          </table>
                        </div>
                      )}
                     </DialogContent>
                 
                </Dialog> 

            </div>
          </Paper>        
        </div>
      </div>
    </>
  );
}
