import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';

const DebugOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getUserOrders();
        console.log('Full API response:', response);
        setOrders(response.orders || response.data || response);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders for debugging...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-100 m-4 rounded">
      <h2 className="text-lg font-bold mb-4">Debug Orders Data</h2>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="bg-white p-4 rounded border">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(order, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugOrders;