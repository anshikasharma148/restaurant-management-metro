import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { settingsAPI } from "@/lib/api"
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
  const [operatingHours, setOperatingHours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const settings = await settingsAPI.getSettings()
        setRestaurantName(settings.restaurantName || "Metro Restaurant")
        setAddress(settings.address || "")
        setPhone(settings.phone || "")
        setTaxRate(String(settings.taxRate || 10))
        setServiceCharge(String(settings.serviceCharge || 0))
        setSoundNotifications(settings.soundNotifications !== false)
        setAutoPrint(settings.autoPrint || false)
        setOperatingHours(settings.operatingHours || [])
      } catch (error: any) {
        toast.error(error.message || "Failed to load settings")
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    try {
      await settingsAPI.updateSettings({
        restaurantName,
        address,
        phone,
        taxRate: parseFloat(taxRate),
        serviceCharge: parseFloat(serviceCharge),
        soundNotifications,
        autoPrint,
        operatingHours,
      })
      toast.success("Settings saved successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings")
    }
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-4 lg:mb-6">Settings</h1>

        <Tabs defaultValue="restaurant" className="space-y-4">
          <TabsList className="w-full flex overflow-x-auto">
            <TabsTrigger value="restaurant" className="flex-1 min-w-0">
              <Store className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Restaurant</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-1 min-w-0">
              <Receipt className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex-1 min-w-0">
              <Clock className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Hours</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 min-w-0">
              <Bell className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          {/* Restaurant Settings */}
          <TabsContent value="restaurant" className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 lg:p-6 space-y-4">
              <h2 className="font-semibold">Restaurant Profile</h2>
              
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
          <TabsContent value="billing" className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 lg:p-6 space-y-4">
              <h2 className="font-semibold">Tax Configuration</h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
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

            <div className="bg-card border border-border rounded-xl p-4 lg:p-6 space-y-4">
              <h2 className="font-semibold">Bill Format Preview</h2>
              
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                <div className="text-center mb-3">
                  <p className="font-bold">{restaurantName}</p>
                  <p className="text-muted-foreground text-xs">{address}</p>
                  <p className="text-muted-foreground text-xs">{phone}</p>
                </div>
                <div className="border-t border-dashed border-border my-2" />
                <div className="flex justify-between text-xs">
                  <span>1x Classic Burger</span>
                  <span>$11.99</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>1x Soft Drink</span>
                  <span>$2.99</span>
                </div>
                <div className="border-t border-dashed border-border my-2" />
                <div className="flex justify-between text-xs">
                  <span>Subtotal</span>
                  <span>$14.98</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Tax ({taxRate}%)</span>
                  <span>${(14.98 * parseFloat(taxRate) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs">
                  <span>Total</span>
                  <span>${(14.98 * (1 + parseFloat(taxRate) / 100)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Hours Settings */}
          <TabsContent value="hours" className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 lg:p-6 space-y-4">
              <h2 className="font-semibold">Operating Hours</h2>
              
              <div className="space-y-3">
                {operatingHours.length > 0 ? (
                  operatingHours.map((hour: any) => (
                    <div key={hour.day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">{hour.day}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={hour.openTime}
                          onChange={(e) => {
                            const updated = operatingHours.map((h: any) =>
                              h.day === hour.day ? { ...h, openTime: e.target.value } : h
                            )
                            setOperatingHours(updated)
                          }}
                          className="w-24 text-sm"
                        />
                        <span className="text-muted-foreground text-sm">to</span>
                        <Input
                          type="time"
                          value={hour.closeTime}
                          onChange={(e) => {
                            const updated = operatingHours.map((h: any) =>
                              h.day === hour.day ? { ...h, closeTime: e.target.value } : h
                            )
                            setOperatingHours(updated)
                          }}
                          className="w-24 text-sm"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-sm">{day}</span>
                      <div className="flex items-center gap-2">
                        <Input type="time" defaultValue="10:00" className="w-24 text-sm" />
                        <span className="text-muted-foreground text-sm">to</span>
                        <Input type="time" defaultValue="22:00" className="w-24 text-sm" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 lg:p-6 space-y-4">
              <h2 className="font-semibold">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Sound Notifications</p>
                    <p className="text-xs text-muted-foreground">Play sound for new orders</p>
                  </div>
                  <Switch checked={soundNotifications} onCheckedChange={setSoundNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Auto Print</p>
                    <p className="text-xs text-muted-foreground">Automatically print new orders</p>
                  </div>
                  <Switch checked={autoPrint} onCheckedChange={setAutoPrint} />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 lg:p-6 space-y-4">
              <h2 className="font-semibold">Printer Configuration</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Printer className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Kitchen Printer</p>
                      <p className="text-xs text-muted-foreground">EPSON TM-T88VI</p>
                    </div>
                  </div>
                  <span className="text-xs text-status-ready font-medium">Connected</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Printer className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Receipt Printer</p>
                      <p className="text-xs text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-4 lg:mt-6">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}