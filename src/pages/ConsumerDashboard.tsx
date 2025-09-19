import { useState } from 'react';
import { ShoppingCart, QrCode, Search, Package, MapPin, Calendar, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { getBatchDetails } from '@/utils/blockchain.js';

interface Product {
  id: string;
  batchId: string;
  name: string;
  price: number;
  retailer: string;
  origin: string;
  harvestDate: string;
  organic: boolean;
  rating: number;
  description: string;
}

interface BatchDetails {
  id: string;
  timestamp: number;
  farmer: string;
  verified: boolean;
  metadata: {
    crop: string;
    location: string;
    harvestDate: string;
    pesticideUsage?: string;
    transportDetails?: {
      vehicleId: string;
      temperature: string;
      pickupDate: string;
      deliveryDate: string;
    };
  };
}

export default function ConsumerDashboard() {
  const [products] = useState<Product[]>([
    {
      id: 'PROD001',
      batchId: 'BATCH001',
      name: 'Organic Tomatoes',
      price: 8.99,
      retailer: 'Fresh Market Store',
      origin: 'Green Valley Farm',
      harvestDate: '2024-01-15',
      organic: true,
      rating: 4.8,
      description: 'Premium organic tomatoes, vine-ripened and pesticide-free.',
    },
    {
      id: 'PROD002',
      batchId: 'BATCH002',
      name: 'Sweet Corn',
      price: 6.99,
      retailer: 'Organic Foods Co.',
      origin: 'Green Valley Farm',
      harvestDate: '2024-01-10',
      organic: true,
      rating: 4.6,
      description: 'Fresh sweet corn, perfect for grilling or steaming.',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<BatchDetails | null>(null);
  const [batchId, setBatchId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScanQR = async () => {
    // Mock QR scanning - in real app, would use camera
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(async () => {
      try {
        // Mock scanned QR data
        const mockQRData = {
          batchId: 'BATCH001',
          type: 'agrichain-batch'
        };

        const details = await getBatchDetails(mockQRData.batchId);
        setSelectedBatch(details);
        setIsDetailsOpen(true);
        setIsScanning(false);

        toast({
          title: "QR Code Scanned Successfully!",
          description: `Found details for batch ${mockQRData.batchId}`,
        });
      } catch (error) {
        setIsScanning(false);
        toast({
          title: "Scan Failed",
          description: "Unable to read QR code. Please try again.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleBatchLookup = async () => {
    if (!batchId.trim()) {
      toast({
        title: "Missing Batch ID",
        description: "Please enter a batch ID to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const details = await getBatchDetails(batchId);
      setSelectedBatch(details);
      setIsDetailsOpen(true);
      setBatchId('');

      toast({
        title: "Batch Found!",
        description: `Retrieved details for batch ${batchId}`,
      });
    } catch (error) {
      toast({
        title: "Batch Not Found",
        description: "Please check the batch ID and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Consumer Dashboard</h1>
        <p className="text-muted-foreground">
          Discover products and verify their journey from farm to store
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-0 shadow-soft bg-gradient-earth">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft bg-gradient-fresh">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Organic Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {products.filter(p => p.organic).length}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft bg-gradient-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Verified Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Tools */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Scanner */}
        <Card className="rounded-2xl border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              Scan product QR codes to verify authenticity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-8 bg-muted rounded-xl">
              {isScanning ? (
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Scanning QR code...</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <QrCode className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Position QR code in view</p>
                </div>
              )}
            </div>
            <Button
              onClick={handleScanQR}
              variant="agricultural"
              size="lg"
              className="w-full"
              disabled={isScanning}
            >
              {isScanning ? 'Scanning...' : 'Start QR Scan (Demo)'}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Lookup */}
        <Card className="rounded-2xl border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Batch Lookup
            </CardTitle>
            <CardDescription>
              Enter a batch ID to get detailed information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                id="batchId"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="BATCH001"
                className="rounded-xl font-mono"
              />
            </div>
            <Button
              onClick={handleBatchLookup}
              variant="outline"
              size="lg"
              className="w-full"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Look Up Batch'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Product Search */}
      <Card className="rounded-2xl border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Product Search
          </CardTitle>
          <CardDescription>
            Search available products by name, batch ID, or origin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="rounded-2xl border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Available Products
          </CardTitle>
          <CardDescription>
            Browse verified products with full traceability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Harvest Date</TableHead>
                  <TableHead>Certification</TableHead>
                  <TableHead>QR Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {product.batchId}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {product.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${product.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {product.origin}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(product.harvestDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.organic && (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-success/10 text-success border border-success/20 text-xs font-medium">
                          <Leaf className="h-3 w-3 mr-1" />
                          Organic
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center p-2 bg-background rounded-lg">
                        <QRCodeSVG
                          value={JSON.stringify({
                            batchId: product.batchId,
                            type: 'agrichain-batch',
                            product: product
                          })}
                          size={48}
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

      {/* Batch Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle>Batch Verification Details</DialogTitle>
            <DialogDescription>
              Complete supply chain information for this product
            </DialogDescription>
          </DialogHeader>
          
          {selectedBatch && (
            <div className="space-y-6">
              {/* Verification Status */}
              <div className="flex items-center justify-center p-4 bg-success/10 rounded-xl border border-success/20">
                <div className="text-center">
                  <div className="text-success font-semibold text-lg">✓ Verified Authentic</div>
                  <div className="text-sm text-muted-foreground">
                    This product has been verified on the blockchain
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Batch ID</Label>
                  <div className="p-2 bg-muted rounded-lg font-mono text-sm">
                    {selectedBatch.id}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Verification Date</Label>
                  <div className="p-2 bg-muted rounded-lg text-sm">
                    {formatDate(selectedBatch.timestamp)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Crop Type</Label>
                  <div className="p-2 bg-muted rounded-lg text-sm">
                    {selectedBatch.metadata.crop}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Farm Location</Label>
                  <div className="p-2 bg-muted rounded-lg text-sm">
                    {selectedBatch.metadata.location}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Harvest Date</Label>
                  <div className="p-2 bg-muted rounded-lg text-sm">
                    {selectedBatch.metadata.harvestDate}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Farmer Address</Label>
                  <div className="p-2 bg-muted rounded-lg text-sm font-mono text-xs">
                    {selectedBatch.farmer}
                  </div>
                </div>
              </div>

              {/* Supply Chain Journey */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Supply Chain Journey</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div>
                      <div className="font-medium text-sm">Farm</div>
                      <div className="text-xs text-muted-foreground">Product harvested and verified</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <div className="font-medium text-sm">Transport</div>
                      <div className="text-xs text-muted-foreground">Safe delivery with temperature control</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <div>
                      <div className="font-medium text-sm">Retail</div>
                      <div className="text-xs text-muted-foreground">Available for purchase</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}