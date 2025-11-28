"use client";

import React, { useState } from "react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { SearchIcon } from "lucide-react";

export interface SearchBarProps {
  className?: string;
  placeholder?: string;
  handleSubmit: (data: string) => void;
}

export const SearchBar = ({
  className,
  placeholder,
  handleSubmit,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = () => {
    if (searchTerm.trim()) {
      handleSubmit(searchTerm);
    }
    setSearchTerm("");
  };

  return (
    <div className={`relative flex ${className}`}>
      <Input
        className="rounded-2xl focus-visible:ring-0 shadow-none bg-white py-2"
        placeholder={placeholder || "Rechercher un produit"}
        value={searchTerm}
        onChange={onChange}
        onKeyDown={(e) => e.key == "Enter" && onSubmit()}
      />
      <Button
        className="absolute right-3 p-0"
        variant="link"
        onClick={onSubmit}
      >
        <SearchIcon size={20} />
      </Button>
    </div>
  );
};
