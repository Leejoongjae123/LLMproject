import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const TableCreationModal = ({ isOpen, onClose, onCreateTable }) => {
  const [step, setStep] = useState(1);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [headerRow, setHeaderRow] = useState(false);
  const [caption, setCaption] = useState('');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    onCreateTable({ rows, cols, headerRow, caption });
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>테이블 생성 - 단계 {step}/4</DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <div className="space-y-4">
            <Label htmlFor="rows">행 수</Label>
            <Input
              id="rows"
              type="number"
              min="1"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
            />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <Label htmlFor="cols">열 수</Label>
            <Input
              id="cols"
              type="number"
              min="1"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value))}
            />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <Label>
              <Input
                type="checkbox"
                checked={headerRow}
                onChange={(e) => setHeaderRow(e.target.checked)}
              />
              헤더 행 포함
            </Label>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <Label htmlFor="caption">캡션 (선택사항)</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        )}
        <DialogFooter>
          {step > 1 && <Button onClick={handleBack}>이전</Button>}
          {step < 4 ? (
            <Button onClick={handleNext}>다음</Button>
          ) : (
            <Button onClick={handleCreate}>생성</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableCreationModal;