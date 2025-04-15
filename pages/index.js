import React from "react";
import Form from "@/components/Form";

const HomePage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-black mb-6">Add New Transaction</h1>
      <Form onTransactionAdded={() => {}} />
    </>
  );
};

export default HomePage;