import { useState } from 'react';
import { Plus, Package, QrCode, MapPin, Calendar, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { addBatchToChain } from '@/utils/blockchain.js';

interface CropBatch {
  id: string;
  cropName: string;
  harvestDate: string;
  quantity: number;
  pesticideUsage: string;
  location: string;
  createdAt: string;
}

export default function FarmerDashboard() {
  const [batches, setBatches] = useState<CropBatch[]>([
    {
      id: 'BATCH001',
      cropName: 'Organic Tomatoes',
      harvestDate: '2024-01-15',
      quantity: 500,
      pesticideUsage: 'None - Organic',
      location: 'Field A, Green Valley Farm',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'BATCH002',
      cropName: 'Sweet Corn',
      harvestDate: '2024-01-10',
      quantity: 750,
      pesticideUsage: 'Minimal organic pesticides',
      location: 'Field B, Green Valley Farm',
      createdAt: '2024-01-10T14:20:00Z',
    },
  ]);

  const [newBatch, setNewBatch] = useState({
    cropName: '',
    harvestDate: '',
    quantity: '',
    pesticideUsage: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const batchId = `BATCH${String(batches.length + 1).padStart(3, '0')}`;
      const batchData = {
        id: batchId,
        ...newBatch,
        quantity: parseInt(newBatch.quantity),
        createdAt: new Date().toISOString(),
      };

      // Add to blockchain (placeholder)
      await addBatchToChain(batchData);

      setBatches([...batches, batchData]);
      setNewBatch({
        cropName: '',
        harvestDate: '',
        quantity: '',
        pesticideUsage: '',
        location: '',
      });

      toast({
        title: "Batch Created Successfully!",
        description: `Batch ${batchId} has been added to the blockchain.`,
      });
    } catch (error) {
      toast({
        title: "Error Creating Batch",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Farmer Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your crop batches and track them through the supply chain
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-0 shadow-soft bg-gradient-earth">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.length}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft bg-gradient-fresh">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.reduce((sum, batch) => sum + batch.quantity, 0)} kg
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft bg-gradient-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Active Farms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Batch Form */}
      <Card className="rounded-2xl border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Upload New Crop Batch
          </CardTitle>
          <CardDescription>
            Register a new harvest batch on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cropName" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Crop Name
                </Label>
                <Input
                  id="cropName"
                  value={newBatch.cropName}
                  onChange={(e) => setNewBatch({...newBatch, cropName: e.target.value})}
                  placeholder="e.g., Organic Tomatoes"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harvestDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Harvest Date
                </Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={newBatch.harvestDate}
                  onChange={(e) => setNewBatch({...newBatch, harvestDate: e.target.value})}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Quantity (kg)
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newBatch.quantity}
                  onChange={(e) => setNewBatch({...newBatch, quantity: e.target.value})}
                  placeholder="500"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={newBatch.location}
                  onChange={(e) => setNewBatch({...newBatch, location: e.target.value})}
                  placeholder="Field A, Green Valley Farm"
                  className="rounded-xl"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pesticideUsage" className="flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                Pesticide Usage
              </Label>
              <Textarea
                id="pesticideUsage"
                value={newBatch.pesticideUsage}
                onChange={(e) => setNewBatch({...newBatch, pesticideUsage: e.target.value})}
                placeholder="None - Organic certified"
                className="rounded-xl"
                required
              />
            </div>
            <Button
              type="submit"
              variant="agricultural"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Creating Batch...' : 'Create Batch & Add to Blockchain'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card className="rounded-2xl border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Previous Batches
          </CardTitle>
          <CardDescription>
            Track all your registered crop batches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Harvest Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>QR Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono font-medium">{batch.id}</TableCell>
                    <TableCell>{batch.cropName}</TableCell>
                    <TableCell>{new Date(batch.harvestDate).toLocaleDateString()}</TableCell>
                    <TableCell>{batch.quantity} kg</TableCell>
                    <TableCell>{batch.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center p-2 bg-background rounded-lg">
                        <QRCodeSVG
                          value={JSON.stringify({
                            batchId: batch.id,
                            type: 'agrichain-batch',
                            data: batch
                          })}
                          size={64}
                          level="M"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}