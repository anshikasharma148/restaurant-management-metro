import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Store,
  Receipt,
  Clock,
  Bell,
  Printer,
  Save,
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [restaurantName, setRestaurantName] = useState("Metro Restaurant")
  const [address, setAddress] = useState("123 Main Street, City")
  const [phone, setPhone] = useState("+1 234 567 8900")
  const [taxRate, setTaxRate] = useState("10")
  const [serviceCharge, setServiceCharge] = useState("0")
  const [soundNotifications, setSoundNotifications] = useState(true)
  const [autoPrint, setAutoPrint] = useState(false)

  const handleSave = () => {
    toast.success("Settings saved successfully")
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

        <Tabs defaultValue="restaurant" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="restaurant">
              <Store className="w-4 h-4 mr-2" />
              Restaurant
            </TabsTrigger>
            <TabsTrigger value="billing">
              <Receipt className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="hours">
              <Clock className="w-4 h-4 mr-2" />
              Hours
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Restaurant Settings */}
          <TabsContent value="restaurant" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Restaurant Profile</h2>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent value="billing" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Tax Configuration</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax Rate (%)</Label>
                  <Input
                    id="tax"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service Charge (%)</Label>
                  <Input
                    id="service"
                    type="number"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Bill Format Preview</h2>
              
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                <div className="text-center mb-4">
                  <p className="font-bold text-lg">{restaurantName}</p>
                  <p className="text-muted-foreground">{address}</p>
                  <p className="text-muted-foreground">{phone}</p>
                </div>
                <div className="border-t border-dashed border-border my-2" />
                <div className="flex justify-between">
                  <span>1x Classic Burger</span>
                  <span>$11.99</span>
                </div>
                <div className="flex justify-between">
                  <span>1x Soft Drink</span>
                  <span>$2.99</span>
                </div>
                <div className="border-t border-dashed border-border my-2" />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$14.98</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({taxRate}%)</span>
                  <span>${(14.98 * parseFloat(taxRate) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(14.98 * (1 + parseFloat(taxRate) / 100)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Hours Settings */}
          <TabsContent value="hours" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Operating Hours</h2>
              
              <div className="space-y-3">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="font-medium">{day}</span>
                    <div className="flex items-center gap-2">
                      <Input type="time" defaultValue="10:00" className="w-32" />
                      <span className="text-muted-foreground">to</span>
                      <Input type="time" defaultValue="22:00" className="w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sound Notifications</p>
                    <p className="text-sm text-muted-foreground">Play sound for new orders</p>
                  </div>
                  <Switch checked={soundNotifications} onCheckedChange={setSoundNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Print</p>
                    <p className="text-sm text-muted-foreground">Automatically print new orders</p>
                  </div>
                  <Switch checked={autoPrint} onCheckedChange={setAutoPrint} />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Printer Configuration</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Printer className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Kitchen Printer</p>
                      <p className="text-sm text-muted-foreground">EPSON TM-T88VI</p>
                    </div>
                  </div>
                  <span className="text-sm text-status-ready">Connected</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Printer className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Receipt Printer</p>
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button size="lg" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
