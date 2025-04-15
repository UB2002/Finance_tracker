import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_BUDGETS = {
  food: 500,
  transportation: 300,
  housing: 1000,
  utilities: 200,
  entertainment: 200,
  healthcare: 300,
  shopping: 400,
  education: 300,
  'personal care': 200,
  others: 200
};

const BudgetSettings = ({ onSave }) => {
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('categoryBudgets');
    return savedBudgets ? JSON.parse(savedBudgets) : DEFAULT_BUDGETS;
  });

  const handleSave = () => {
    localStorage.setItem('categoryBudgets', JSON.stringify(budgets));
    onSave(budgets);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Set Budget Limits</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Monthly Category Budgets</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(budgets).map(([category, amount]) => (
            <div key={category} className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right capitalize">{category}</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setBudgets({ ...budgets, [category]: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <Button onClick={handleSave}>Save Budgets</Button>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetSettings;