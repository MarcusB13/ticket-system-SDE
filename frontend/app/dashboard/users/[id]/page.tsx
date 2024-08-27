import React from "react";
import axiosInstance from "@/lib/api";

interface Props {
  params: {
    id: string;
  };
}

export default function page({ params }: Props) {
  const id = params.id;

  

  return <div>page</div>;
}
