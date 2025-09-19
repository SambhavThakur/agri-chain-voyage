import { useState } from 'react';
import { Store, Package, DollarSign, Plus, Minus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  batchId: string;
  name: string;
  quantity: number;
  price: number;
  cost: number;
  supplier: string;
  receivedDate: string;
  expiryDate: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface StockUpdate {
  productId: string;
  quantity: number;
  price: number;
}

export default function RetailerDashboard() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'PROD001',
      batchId: 'BATCH001',
      name: 'Organic Tomatoes',
      quantity: 250,
      price: 8.99,
      cost: 5.50,
      supplier: 'Green Valley Farm',
      receivedDate: '2024-01-16',
      expiryDate: '2024-01-25',
      status: 'in-stock',
    },
    {
      id: 'PROD002',
      batchId: 'BATCH002',
      name: 'Sweet Corn',
      quantity: 15,
      price: 6.99,
      cost: 4.20,
      supplier: 'Green Valley Farm',
      receivedDate: '2024-01-15',
      expiryDate: '2024-01-30',
      status: 'low-stock',
    },
  ]);

  const [updateData, setUpdateData] = useState<StockUpdate>({
    productId: '',
    quantity: 0,
    price: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const updateStock = (productId: string, quantityChange: number) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        const newQuantity = Math.max(0, product.quantity + quantityChange);
        const newStatus = newQuantity === 0 ? 'out-of-stock' : newQuantity < 20 ? 'low-stock' : 'in-stock';
        return { ...product, quantity: newQuantity, status: newStatus };
      }
      return product;
    }));

    toast({
      title: "Stock Updated",
      description: `Stock quantity ${quantityChange > 0 ? 'increased' : 'decreased'} successfully.`,
    });
  };

  const updatePrice = () => {
    if (!updateData.productId || updateData.price <= 0) return;

    setProducts(products.map(product => 
      product.id === updateData.productId 
        ? { ...product, price: updateData.price }
        : product
    ));

    setIsDialogOpen(false);
    setUpdateData({ productId: '', quantity: 0, price: 0 });

    toast({
      title: "Price Updated",
      description: "Product price has been updated successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-success/10 text-success border-success/20';
      case 'low-stock': return 'bg-warning/10 text-warning border-warning/20';
      case 'out-of-stock': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.cost), 0);
  const totalRevenue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  const lowStockItems = products.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Retailer Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your inventory, pricing, and stock levels
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl border-0 shadow-soft bg-gradient-earth">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft bg-gradient-fresh">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft bg-gradient-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Potential Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft bg-warning/10 border border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-warning">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockItems}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-2xl border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Manage your inventory efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="h-20 flex-col">
                  <Edit className="h-6 w-6 mb-2" />
                  Update Prices
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Update Product Price</DialogTitle>
                  <DialogDescription>
                    Select a product and set a new price
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productSelect">Product</Label>
                    <select
                      id="productSelect"
                      value={updateData.productId}
                      onChange={(e) => setUpdateData({...updateData, productId: e.target.value})}
                      className="w-full p-2 border rounded-xl"
                    >
                      <option value="">Select a product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - Current: ${product.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPrice">New Price ($)</Label>
                    <Input
                      id="newPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={updateData.price || ''}
                      onChange={(e) => setUpdateData({...updateData, price: parseFloat(e.target.value)})}
                      placeholder="8.99"
                      className="rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={updatePrice}
                    variant="agricultural"
                    disabled={!updateData.productId || updateData.price <= 0}
                    className="w-full"
                  >
                    Update Price
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="lg" className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              Receive Shipment
            </Button>

            <Button variant="outline" size="lg" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="rounded-2xl border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Current Inventory
          </CardTitle>
          <CardDescription>
            Manage stock levels and pricing for all products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Retail Price</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Expires: {new Date(product.expiryDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.batchId}</TableCell>
                    <TableCell className="font-medium">{product.quantity} kg</TableCell>
                    <TableCell>${product.cost.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-success">
                      {(((product.price - product.cost) / product.cost) * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status.replace('-', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateStock(product.id, -5)}
                          disabled={product.quantity === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateStock(product.id, 5)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
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