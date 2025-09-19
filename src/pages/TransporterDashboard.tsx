import { useState } from 'react';
import { Truck, Package, MapPin, Thermometer, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateTransportStatus } from '@/utils/blockchain.js';

interface TransportBatch {
  id: string;
  batchId: string;
  cropName: string;
  quantity: number;
  origin: string;
  destination: string;
  status: 'pending' | 'in-transit' | 'delivered';
  vehicleId?: string;
  pickupDate?: string;
  deliveryDate?: string;
  temperature?: string;
  condition?: string;
}

interface TransportUpdate {
  vehicleId: string;
  pickupDate: string;
  deliveryDate: string;
  temperature: string;
  condition: string;
}

export default function TransporterDashboard() {
  const [batches, setBatches] = useState<TransportBatch[]>([
    {
      id: 'TRANS001',
      batchId: 'BATCH001',
      cropName: 'Organic Tomatoes',
      quantity: 500,
      origin: 'Green Valley Farm',
      destination: 'Fresh Market Store',
      status: 'pending',
    },
    {
      id: 'TRANS002',
      batchId: 'BATCH002',
      cropName: 'Sweet Corn',
      quantity: 750,
      origin: 'Green Valley Farm',
      destination: 'Organic Foods Co.',
      status: 'in-transit',
      vehicleId: 'TRUCK-001',
      pickupDate: '2024-01-16',
      temperature: '2-4°C',
      condition: 'Excellent',
    },
  ]);

  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [updateData, setUpdateData] = useState<TransportUpdate>({
    vehicleId: '',
    pickupDate: '',
    deliveryDate: '',
    temperature: '',
    condition: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleUpdateTransport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;

    setIsSubmitting(true);

    try {
      // Update blockchain
      await updateTransportStatus(selectedBatch, updateData);

      // Update local state
      setBatches(batches.map(batch => 
        batch.id === selectedBatch 
          ? { ...batch, ...updateData, status: 'in-transit' as const }
          : batch
      ));

      setUpdateData({
        vehicleId: '',
        pickupDate: '',
        deliveryDate: '',
        temperature: '',
        condition: '',
      });
      setSelectedBatch('');

      toast({
        title: "Transport Updated Successfully!",
        description: "Batch status has been updated on the blockchain.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAsDelivered = async (batchId: string) => {
    try {
      await updateTransportStatus(batchId, { status: 'delivered' });
      
      setBatches(batches.map(batch => 
        batch.id === batchId 
          ? { ...batch, status: 'delivered' as const }
          : batch
      ));

      toast({
        title: "Delivery Confirmed!",
        description: "Batch has been marked as delivered.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-warning';
      case 'in-transit': return 'text-primary';
      case 'delivered': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'in-transit': return 'bg-primary/10 text-primary border-primary/20';
      case 'delivered': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Transporter Dashboard</h1>
        <p className="text-muted-foreground">
          Manage transport logistics and update delivery status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {batches.filter(b => b.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft bg-gradient-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.filter(b => b.status === 'in-transit').length}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft bg-success text-success-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-success-foreground/80">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.filter(b => b.status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update Transport Form */}
      <Card className="rounded-2xl border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Update Transport Details
          </CardTitle>
          <CardDescription>
            Update pickup, delivery, and condition information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateTransport} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batchSelect">Select Batch</Label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Choose a batch to update" />
                </SelectTrigger>
                <SelectContent>
                  {batches.filter(b => b.status !== 'delivered').map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.batchId} - {batch.cropName} ({batch.quantity}kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBatch && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId" className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Vehicle ID
                    </Label>
                    <Input
                      id="vehicleId"
                      value={updateData.vehicleId}
                      onChange={(e) => setUpdateData({...updateData, vehicleId: e.target.value})}
                      placeholder="TRUCK-001"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature" className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Temperature Range
                    </Label>
                    <Input
                      id="temperature"
                      value={updateData.temperature}
                      onChange={(e) => setUpdateData({...updateData, temperature: e.target.value})}
                      placeholder="2-4°C"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pickup Date
                    </Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={updateData.pickupDate}
                      onChange={(e) => setUpdateData({...updateData, pickupDate: e.target.value})}
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Expected Delivery
                    </Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={updateData.deliveryDate}
                      onChange={(e) => setUpdateData({...updateData, deliveryDate: e.target.value})}
                      className="rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Condition Notes
                  </Label>
                  <Textarea
                    id="condition"
                    value={updateData.condition}
                    onChange={(e) => setUpdateData({...updateData, condition: e.target.value})}
                    placeholder="Excellent condition, properly refrigerated"
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
                  {isSubmitting ? 'Updating...' : 'Update Transport Status'}
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Assigned Batches Table */}
      <Card className="rounded-2xl border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Assigned Batches
          </CardTitle>
          <CardDescription>
            All batches assigned to your transport company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono font-medium">{batch.batchId}</TableCell>
                    <TableCell>{batch.cropName}</TableCell>
                    <TableCell>{batch.quantity} kg</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {batch.origin}
                        </div>
                        <div className="text-muted-foreground">↓</div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {batch.destination}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-medium ${getStatusBadge(batch.status)}`}>
                        {batch.status}
                      </span>
                    </TableCell>
                    <TableCell>{batch.vehicleId || '-'}</TableCell>
                    <TableCell>
                      {batch.status === 'in-transit' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => markAsDelivered(batch.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Delivered
                        </Button>
                      )}
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