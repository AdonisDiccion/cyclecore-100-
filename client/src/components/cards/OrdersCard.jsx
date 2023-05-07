import { Grid, Box, Typography, Button, InputLabel, Dialog, DialogTitle, DialogContent, Select, MenuItem, DialogContentText } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { TbDotsVertical } from "react-icons/tb";
import { TiArrowBack } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import { MdOutlineHistoryEdu } from "react-icons/md";

function OrdersCard({ o }) {
  //context
  const [auth, setAuth] = useAuth();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
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


  return (
    <div className="font-bebas bg-gray-200 h-screen px-10 py-5">
      <div className="mx-auto">

        <div className="py-2 px-4 bg-white border-b flex items-center justify-between">
          <div className="flex gap-1 items-center text-3xl">
            <h1 className="font-bold tracking-wider">Order History </h1>
            {/* <IoFish className="text-sky-500"/> */}<MdOutlineHistoryEdu className="text-yellow-500"/>
          </div>
          
          <div>
            <NavLink to="/dashboard/admin/orders">
            <Button variant="contained" color="inherit" size="small" startIcon={<TiArrowBack/>}><span className="tracking-wider text-lg font-bebas font-bold">Back</span></Button>
            </NavLink>       
          </div>
        </div>

        <div className="bg-white p-4 shadow-lg">
   
          <table className="border w-full">
            <thead className="text-xl tracking-wide border-b">
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Order ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Product</th>
                <th className="p-2">Price</th>
                <th className="p-2">Email</th>
                <th className="p-2">Order Date</th>
                <th></th>
              </tr>
            </thead>
            
            <tbody>
              {o?.products?.map((p) => (
                
                <tr key={p._id} className="border-b">
                  
                  <td className="p-2">{o.ordernumber}</td>
                  
                  
                  <td className="p-2">{o?.buyer?.lastname} {o?.buyer?.firstname}</td>
                  
                  <td className="p-2">{p.name}</td>
                                   
                  <td className="p-2">{p.price.toLocaleString('en-US', {style: 'currency', currency: 'PHP'})}</td>

                  <td className="p-2">{o?.buyer?.email}</td>

                  <td className="p-2">{moment(o?.createdAt).format("MMMM Do YYYY, h:mm:ss")}</td>
                  
                  <td className="p-2">
                    <div className="p-1 w-[27px] rounded-sm hover:bg-gray-100 hover:cursor-pointer">
                      <button className="text-lg" onClick={() => handleOrderDetailsClick(o)}>
                          <TbDotsVertical/>      
                      </button>
                    </div>      
                  </td>
                </tr>
              ))}
            </tbody>
            
          </table>

        </div>
        
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
    </div>
  );
}

export default OrdersCard;
