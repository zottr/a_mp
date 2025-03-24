import React, { useRef, useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
  GET_ORDERS_LIST,
  UPDATE_ORDER_CUSTOM_FIELDS,
} from '../../libs/graphql/definitions/order-definitions';

const OrdersList = () => {
  const ITEMS_PER_LOAD = 10;
  const [orders, setOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { loading, error, data, fetchMore } = useQuery(GET_ORDERS_LIST, {
    variables: { skip: 0, take: ITEMS_PER_LOAD, sort: { createdAt: 'DESC' } },
    fetchPolicy: 'cache-and-network',
    onCompleted: (fetchedData) => {
      setOrders(fetchedData.orders.items);
      setHasMore(
        fetchedData.orders.items.length < fetchedData.orders.totalItems
      );
    },
  });

  const [updateOrder] = useMutation(UPDATE_ORDER_CUSTOM_FIELDS);

  const handleUpdateOrder = async (id) => {
    try {
      const { data } = await updateOrder({
        variables: {
          id,
          customFields: {
            adminStatus: 'new', // Example field update
          },
        },
      });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id
            ? { ...order, customFields: data.updateOrder.customFields }
            : order
        )
      );
      alert(`Order ${id} marked as reviewed.`);
    } catch (err) {
      console.error('Error updating order:', err.message);
    }
  };

  const observer = useRef();

  const loadMore = () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    fetchMore({
      variables: {
        skip: orders.length,
        take: ITEMS_PER_LOAD,
        sort: { createdAt: 'DESC' },
      },
    }).then(({ data: fetchedData }) => {
      const newOrders = fetchedData.orders.items;
      setOrders((prevOrders) => [...prevOrders, ...newOrders]);
      setHasMore(
        orders.length + newOrders.length < fetchedData.orders.totalItems
      );
      setLoadingMore(false);
    });
  };

  const lastOrderRef = useRef();

  useEffect(() => {
    if (loading || !hasMore) return;

    const handleIntersect = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        loadMore();
      }
    };

    const currentObserver = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 1.0,
    });

    if (lastOrderRef.current) {
      currentObserver.observe(lastOrderRef.current);
    }

    return () => {
      if (lastOrderRef.current) {
        currentObserver.unobserve(lastOrderRef.current);
      }
    };
  }, [lastOrderRef, hasMore, loadingMore]);

  if (loading && orders.length === 0) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders: {error.message}</p>;

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order, index) => (
          <li
            key={order.id}
            ref={index === orders.length - 1 ? lastOrderRef : null}
          >
            <p>
              <strong>Order Code:</strong> {order.code}
            </p>
            <p>
              <strong>Total:</strong> {order.total}
            </p>
            <p>
              <strong>State:</strong> {order.state}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Reviewed:</strong> {order.customFields?.adminStatus}
            </p>
            <button onClick={() => handleUpdateOrder(order.id)}>
              Mark as Reviewed
            </button>
          </li>
        ))}
      </ul>
      {loadingMore && <p>Loading more...</p>}
      {!hasMore && <p>End of the list.</p>}
    </div>
  );
};

export default OrdersList;
