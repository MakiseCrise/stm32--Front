interface Navigator {
    bluetooth: Bluetooth;
}

interface Bluetooth {
    requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
}

// 如果你使用的是 GATT 连接等其他功能，也可以在这里声明相关的类型
interface BluetoothDevice {
    gatt: BluetoothRemoteGATTServer | null;
    name?: string;
    id: string;
}

interface BluetoothRemoteGATTServer {
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(serviceUUID: string): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
    getCharacteristic(characteristicUUID: string): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
    readValue(): Promise<DataView>;
}
