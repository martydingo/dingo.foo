
import { getPayload } from 'payload'
import config from '@payload-config'

import {
    convertMarkdownToLexical,
    editorConfigFactory,
} from '@payloadcms/richtext-lexical'

export default async function toMarkdown() {
    const payload = await getPayload({ config })
    const payloadConfig = await config
    const lexicalJSON = convertMarkdownToLexical({
        editorConfig: await editorConfigFactory.default({
            payloadConfig, // <= make sure you have access to your Payload Config
        }),
        markdown: `
In this article, we'll deploy a network that back-end, front-end and storage area networks can communicate over!

## Introduction

Following on from [[Blog - Old/Deploying Kubernetes Public/Deploying Kubernetes - Part 1 - Deploying VMWare ESXI]], we'll now implement our core network on top of VMWare ESXI, as so we can create our own internal networks that our hosts can communicate on.

> IPv6 Support Under Construction
> 
> ---
> Additional resource is currently under construction for the implementation of our IPv6 networks.

We'll be using Mikrotik CHRs for this, be aware that to transit above *>1 mbit* of traffic through a Mikrotik CHR, you will need a license, which as of this article the cost of which is around $50 USD, which allows up to 1gbit of traffic through.

We'll be creating two routers for this, a router for our back-end networks, and another router for our front-end networks.

Our network will look a little like so:

\`\`\`mermaid
%%{init: {'theme': 'base', 'flowchart': { 'curve': 'monotoneY', 'width':'100%'}, 'themeVariables': { 'fontSize':'24', 'fontFamily': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace', 'background': '#1e293b', 'lineColor': '#cbd5e1', 'primaryColor': '#475569', 'primaryBorderColor': '#94a3b8', 'primaryTextColor': '#f8fafc', 'secondaryColor': '#475569', 'secondaryTextColor': '#f1f5f9', 'secondaryBorderColor': '#94a3b8', 'tertiaryColor': '#334155', 'tertiaryTextColor': '#e2e8f0', 'tertiaryBorderColor': '#94a3b8', 'darkMode': 'true'} } }%%
flowchart
direction LR

a.cp[Control Plane]
a.w[Worker Node A]
b.w[Worker Node B]
c.w[Worker Node C]

i65.108.22.2[65.108.22.2]
i65.108.22.3[65.108.22.3]
i65.108.22.4[65.108.22.4]
i95.216.46.70[95.216.46.70]
i95.216.46.92[95.216.46.92]

subgraph Internet
	65.108.23.65["65.108.23.65 (Hetzner Gateway)"]
	65.108.22.1["65.108.22.1 (Hetzner Gateway)"]
	95.216.46.65["95.216.46.65 (Hetzner Gateway)"]
end 

subgraph "Front-End Networks (r1-fe.routing.nic.dingo.services)"
	65.108.23.70["65.108.23.70 (Primary srcNAT IP)"]
	65.108.22.2
	65.108.22.3
	65.108.22.4
	95.216.46.70
	95.216.46.92
	subgraph "Routing Networks"
		subgraph "VRF-65.108.22.2 (VLAN2)"
			65.108.22.2 <--> 172.16.2.1
		end
		subgraph "VRF-65.108.22.3 (VLAN3)"
			65.108.22.3 <--> 172.16.3.1
		end
		subgraph "VRF-65.108.22.4 (VLAN4)"
			65.108.22.4 <--> 172.16.4.1
		end
		subgraph "VRF-95.216.46.70 (VLAN5)"
			95.216.46.70 <--> 172.16.5.1
		end
		subgraph "VRF-95.216.46.92 (VLAN6)"
			95.216.46.92 <--> 172.16.6.1
		end
		172.16.2.1 
		172.16.3.1 
		172.16.4.1 
		172.16.5.1 
		172.16.6.1 
	end
end

subgraph "Back-End Networks (r1-be.routing.nic.dingo.services)"
	10.0.0.254["10.0.0.254 (SAN Gateway)"]
	10.3.0.254["10.3.0.254 (Default Gateway)"]
	10.0.0.254 <--> 65.108.23.70
	10.3.0.254 <--> 65.108.23.70
	subgraph Kubernetes Network
		subgraph Core Kubernetes Network
			a.w <--> 10.3.0.254
			b.w <--> 10.3.0.254
			c.w <--> 10.3.0.254
			a.cp <--> 10.3.0.254
		end
		subgraph SAN Network
			a.w <--> 10.0.0.1
			b.w <--> 10.0.0.1
			c.w <--> 10.0.0.1
			10.0.0.1["10.0.0.1 (Network File Storage)"] <--> 10.0.0.254
		end
		subgraph Kubernetes Service Endpoints
			i65.108.22.2 <--> a.w
			i65.108.22.3 <--> a.w
			i65.108.22.4 <--> a.w
			i95.216.46.70 <--> a.w
			i95.216.46.92 <--> a.w
			i65.108.22.2 <--> b.w
			i65.108.22.3 <--> b.w
			i65.108.22.4 <--> b.w
			i95.216.46.70 <--> b.w
			i95.216.46.92 <--> b.w
			i65.108.22.2 <--> c.w
			i65.108.22.3 <--> c.w
			i65.108.22.4 <--> c.w
			i95.216.46.70 <--> c.w
			i95.216.46.92 <--> c.w
		end
	end


	subgraph "Service Networks"
	    172.16.2.2 
	    172.16.3.2 
	    172.16.4.2 
	    172.16.5.2 
	    172.16.6.2 
		172.16.2.2 <--> i65.108.22.2
		172.16.3.2 <--> i65.108.22.3
		172.16.4.2 <--> i65.108.22.4
		172.16.5.2 <--> i95.216.46.70
		172.16.6.2 <--> i95.216.46.92

	end
end

65.108.23.65 <--> 65.108.23.70
65.108.22.1 <--> 65.108.22.2
65.108.22.1 <--> 65.108.22.3
65.108.22.1 <--> 65.108.22.4
95.216.46.65 <--> 95.216.46.70
95.216.46.65 <--> 95.216.46.92

172.16.2.1 <-.-> 172.16.2.2 
172.16.3.1 <-.-> 172.16.3.2 
172.16.4.1 <-.-> 172.16.4.2 
172.16.5.1 <-.-> 172.16.5.2 
172.16.6.1 <-.-> 172.16.6.2 
\`\`\`

## IP Schema

Let's cover the plan of attack on how we'll address our systems.
#### Public Networks

We have the following /32's assigned to us, and I have designated these addresses as follows:

- 65.108.23.70 - Primary Traffic
- 65.108.22.2 - Nginx Ingress
- 65.108.22.3 - Nameserver A
- 65.108.22.4 - Nameserver B
- 95.216.46.70 - Applications 1
- 95.216.46.92 - Applications 2

#### SAN Network

*10.0.0.0/24*

We'll seperate the SAN network and the Kubernetes network, so we can bypass the 1gbit bandwidth limitation using Mikrotik CHR's by configuring this network to transit traffic between systems directly over our ESXI vSwitch, rather then through our Mikrotik CHR.

- NFS Sever: 10.0.0.1
- Control Node - 10.0.0.2
- Worker Node A - 10.0.0.3
- Worker Node B - 10.0.0.4
- Worker Node C - 10.0.0.5
- Gateway: 10.0.0.254

#### Kubernetes Network  

*10.1.0.0/22*

Next, we'll designate our Kubernetes networks.

- Control Node - 10.1.0.1
- Worker Node A - 10.1.1.1
- Worker Node B - 10.1.2.1
- Worker Node C - 10.1.3.1
- Gateway: 10.0.3.254

#### Routing Networks

And finally we'll designate our Routing Networks that will sit between our front-end and back-end routers. Note that these will operate over VLANs to segment the broadcast domains of each routing network.

- VLAN1 (Main Routing Network & OSPF): 172.16.1.0/30
- VLAN2 (Routing Network for 65.108.22.2): 172.16.2.0/30
- VLAN3 (Routing Network for 65.108.22.3): 172.16.3.0/30
- VLAN4 (Routing Network for 65.108.22.4): 172.16.4.0/30
- VLAN5 (Routing Network for 95.216.46.70): 172.16.5.0/30
- VLAN6 (Routing Network for 95.216.46.92): 172.16.6.0/30

## Mikrotik CHR Image Preperation

1. SSH onto the ESXI Host.
   \`ssh root@<ip_of_host>\`

2. Change your working directory to the datastore. If you've been following this series, this will be located at \`/vmfs/volumes/datastore1/\`
   \`cd /vmfs/volumes/<datastore>/\`
   aka \`cd /vmfs/volumes/datastore1/\`

3. Download the Mikrotik CHR VMDK disk image to the datastore
   This can be downloaded from <https://mikrotik.com/download>, and selecting the *Stable* *VMDK image* download link, nested under the *Cloud Hosted Router* heading.
   e.g. \`wget https://download.mikrotik.com/routeros/7.4.1/chr-7.4.1.vmdk\`

   **NOTE:** You may need to edit the firewall policy to allow downloads through, alternatively the firewall module can be unloaded by running

   \`esxcli network firewall unload\`

   **NOTE:** At the time of this article, appending \`--no-check-certificate\` to the \`wget\` command was required for the image to download, otherwise the error \`wget: error getting response: Cannot assign requested address\` was encountered.

4. Convert the VMDK into a disk ready to be used by the CHR VM
   \`vmkfstools -i chr-7.4.1.vmdk disk-<name_of_frontend_router_to_be>.vmdk -d thin\`
   e.g
   \`vmkfstools -i chr-7.4.1.vmdk disk-core.routing.nic.dingo.services.vmdk -d thin\`

5. Expand the new VMDK to 512MB
   \`vmkfstools -X 512M disk-<name_of_frontend_router_to_be>.vmdk\`
   e.g.
   \`vmkfstools -X 512M disk-core.routing.nic.dingo.services.vmdk\`

## (Optional) Request Virtualisation Adapter

If the hosting provider requires you to configure a specific MAC address on an interface for an additional single IP address to be assigned, you should request such before proceding.

Hetzner does require this, and this option can be found within the Robot control panel on Hetzner.

If you require IPv6, then it's also required that you set the MAC address of the allocated /64 to the additional IP addresses MAC, which can also be done in the Robot control panel on Hetzner.

## ESXI Networking Configuration

We'll run through some of the prerequisite network configurations within ESXI before we can attach any virtual machines to a network that can communicate with the outside world.

1. From the initial front page of ESXI, select Networking on the left hand side menu.
2. Select *Virtual Switches*
   1. Add a vSwitch
      1. **Name:** *vSwitch1*
      1. **MTU:** *9000*
      1. **Security:**
         1. **Promiscuous mode:** *Accept* (for DHCP & Broadcast to work effectively)
         2. **MAC address changes:** *Accept* (So we can update our interface MAC addresses)
   2. Add a second vSwitch
      1. **Name:** *vSwitch2*
      1. **MTU:** *9000*
      1. **Security:**
         1. **Promiscuous mode:** *Accept* (for DHCP & Broadcast to work effectively)
         2. **MAC address changes:** *Accept* (So we can update our interface MAC addresses)
   3. Add a third vSwitch
      1. **Name:** *vSwitch3*
      1. **MTU:** *9000*
      1. **Security:**
         1. **Promiscuous mode:** *Accept* (for DHCP & Broadcast to work effectively)
         2. **MAC address changes:** *Accept* (So we can update our interface MAC addresses)
3. Select *Port Groups*
   1. Delete the default Port Group *VM Networks*
   2. Add new Port Group
      1. **Name:** *Upstream Network*
      1. **Virtual switch:** *vSwitch0*
   3. Add another new Port Group
      1. **Name:** *Kubernetes Network*
      1. **Virtual switch:** *vSwitch1*
   4. Add another new Port Group
      1. **Name:** *Storage Area Network*
      1. **Virtual switch:** *vSwitch2*
   5. Add another new Port Group
      1. **Name:** *Back-end .-. Front-end*
      1. **Virtual switch:** *vSwitch3*

## VM Creation

Now to creating the virtual machines which will serve as our routers. These instructions are pretty much identical for both the front-end and back-end routers, with the exception of our networking adaptor configuration.

### Front End Router

1. Create a new virtual machine
   1. Click *Create/Register VM*
   2. Select *Create a new virtual machine*, press next
   3. Enter the following details:
      1. **Name:** *front-end.routing.nic.dingo.services*
      2. **Compatibility:** The latest ESXI version
      3. **Guest OS Family:** *Linux*
      4. **Guest OS Version:** *Ubuntu Linux (64-bit)*
        Press Next
   4. Select the datastore. e.g. \`datastore1\`
   5. Configure the VM
       1. **CPU:** The maximum the dropdown reflects.
       2. **Memory:** *1024mb*
       3. **Hard Disk:** Remove this
       4. **Network Adaptors**
       For the sake of keeping these instructions simple, delete the existing network interface, then:
          1. Click **New Network Adaptor**
              1. Configure the interface to reside within the *Upstream Networks* port group
              2. Configure the **MAC Address**
              3. Select **Manual**
              4. Enter the MAC address obtained in the *Request Virtualisation Adapter* step
              5. Repeat these steps for each public IP requiring assignment. Do ensure these interfaces are configured within the **Upstream Network** port group, and that the MAC address configured is the MAC address assigned to you in the Hetzner control panel, obtained by following the instructions contained within the *Request Virtualisation Adapter* step.
          1. Click **New Network Adaptor**
              1. Configure the interface to reside within the *Back-end .-. Front-end* port group
       5. Remove **CD/DVD Drive 1**
   6. Click next, then click finish

2. Via SSH, move the previously created VMDK copy of the Mikrotik CHR image into the virtual machine folder.

   1. SSH onto the ESXI Host.
      \`ssh root@<ip_of_host>\`

   2. Change your working directory to the datastore. If you've been following this series, this will be located at \`/vmfs/volumes/datastore1/\`
      \`cd /vmfs/volumes/<datastore>/\`
      aka \`cd /vmfs/volumes/datastore1/\`

   3. Copy the previously created VMDK copy of the Mikrotik CHR image into the virtual machine folder
      \`mv disk-<name_of_router_to_be>.vmdk* fdisk-<name_of_router_to_be>/\` e.g.\`mv disk-core.routing.nic.dingo.services\* core.routing.nic.dingo.services/\`

3. Edit the new virtual machine, and add the hard disk
   1. Select the virtual machine, and click the *Edit* button
   2. Click *Add hard disk*
   3. Click *Existing hard disk*
   4. Select the previously created VMDK
   5. Press *Save*

4. Power on the freshly created virtual machine

### Back End Router

1. Create a new virtual machine
   1. Click *Create/Register VM_
   2. Select *Create a new virtual machine*, press next
   3. Enter the following details:
      1. **Name:** *front-end.routing.nic.dingo.services*
      2. **Compatibility:** The latest ESXI version
      3. **Guest OS Family:** *Linux*
      4. **Guest OS Version:** *Ubuntu Linux (64-bit)*
        Press Next
   4. Select the datastore. e.g. \`datastore1\`
   5. Configure the VM
       1. **CPU:** The maximum the dropdown reflects.
       2. **Memory:** *1024mb*
       3. **Hard Disk:** Remove this
       4. **Network Adaptors**
       For the sake of keeping these instructions simple, delete the existing network interface, then:
          1. Click **New Network Adaptor**
              1. Configure the interface to reside within the *Back-end <-> Front-end* port group
          2. Click **New Network Adaptor**
              1. Configure the interface to reside within the *Kubernetes Network* port group
          3. Click **New Network Adaptor**
              1. Configure the interface to reside within the *Storage Area Network* port group
       5. Remove **CD/DVD Drive 1**
   6. Click next, then click finish

2. Via SSH, move the previously created VMDK copy of the Mikrotik CHR image into the virtual machine folder.

   1. SSH onto the ESXI Host.
      \`ssh root@<ip_of_host>\`

   2. Change your working directory to the datastore. If you've been following this series, this will be located at \`/vmfs/volumes/datastore1/\`
      \`cd /vmfs/volumes/<datastore>/\`
      aka \`cd /vmfs/volumes/datastore1/\`

   3. Copy the previously created VMDK copy of the Mikrotik CHR image into the virtual machine folder
      \`mv disk-<name_of_router_to_be>.vmdk* fdisk-<name_of_router_to_be>/\`
       e.g. \`mv disk-core.routing.nic.dingo.services\* core.routing.nic.dingo.services/\`

3. Edit the new virtual machine, and add the hard disk
   1. Select the virtual machine, and click the *Edit* button
   2. Click *Add hard disk*
   3. Click *Existing hard disk*
   4. Select the previously created VMDK
   5. Press *Save*

4. Power on the freshly created virtual machine

## Router Configuration

### Generic Configuration

Let's go configure these routers! We'll start by configuring both routers with their generic configurations, then we'll drill down and further configure each router based on their role.  

#### Authentication

First things first, though, It's best that we change the admin password immediately.

> [!Warning] Security Concern
> It is safer to initialise the router without the external networking adaptor, change user credentials, then configure the adaptor following that, but it's definitely down to the user and their appetite for risk. I have regularly observed login attempts using default credentials from bots within about ten seconds of a new IP address being assign. Here definitely be dragons.

On the first boot of Mikrotik CHR, the router should ask you to configure a new password. With the routers previously created powered on, open up the web console for each router, and set the password of your choosing. In the off chance that a password prompt does not appear, the password can be immediately changed by running \`/user set admin password=<password>\` in a RouterOS command prompt.

We should be able to use a GUI to configure the Mikrotik, by connecting *Winbox* to the additional IP address correlating to the MAC address previously assigned during the configuration of the virtual machine.

#### Licensing

Next, we'll need to license the router. If you don't have a license, you can get a one month trial by creating a Mikrotik account, and following these steps.

1. Click System, then License
   1. Click Renew License, and enter your Mikrotik account details, and the P1 license level.

### Front End Router

We'll now configure our front-end router.

#### Identity

We'll rename the router to *front-end.routing.nic.dingo.services*

1. Click System -> Identity.
2. Rename to your desired name, we will be using *front-end.routing.nic.dingo.services*, then click OK.

#### Adjust MTU

1. Click interfaces, then select the ethernet tab.
2. Double click ether7, and set the MTU to 9000

#### Add Loopback Interface & Loopback Address

1. Click *Bridge*
2. Click the blue plus icon
3. Enter the following details and press *OK*
   - **Name:** \`lo0\`
4. Click on IP -> Addresses
5. Click the blue plus icon
6. Enter the following details and press *OK*
   - **Address:** \`10.255.1.1\`
   - **Network:** \`10.255.1.1\`
   - **Interface:** \`lo0\`

#### DHCP Clients

For each interface configured previously with a manual MAC address (for the purposes of public address assignment), undertake the following:

1. Click IP -> DHCP-Client
2. Click the blue plus sign to add a DHCP Client
3. Configure the interface by selecting the required interface for the DHCP client to be run on
4. If the interface is not ether1, then untick the 'Add Default Route' checkbox to ensure only one gateway is added to the route table.
5. Press OK

In my run through, I repeated these instructions 6 times, for 6 public IPs that will reside from ether1-ether6.

Note that ether1 may already have a DHCP client configured, and if so, it will have the default gateway checkbox ticked. The step to add a dhcp-client to ether1 may be skipped if this is the case.

#### VLANs

1. Click Interfaces
2. Click the blue plus sign, then select *VLAN* to add a new VLAN.
3. For each VLAN required (one for each public address), undertake the following:
4. Name the VLAN *ether[x].[vlan_number]*, for myself the first vlan will be ether7.2, and the last VLAN name will be ether7.6.
5. Configure the VLAN-ID to match the required VLAN.

For our build, the VLANs will be as follows:

- ether7 (Physical Interface, VLAN1, Native)
- ether7.2 (Physical Interface, VLAN2, Tagged)
- ether7.3 (Physical Interface, VLAN3, Tagged)
- ether7.4 (Physical Interface, VLAN4, Tagged)
- ether7.5 (Physical Interface, VLAN5, Tagged)
- ether7.6 (Physical Interface, VLAN6, Tagged)

#### IP Addresses

1. Click IP -> Addresses
2. Click the blue plus sign to add an IP address, then configure the following addresses:
    1. **Address:** \`172.16.1.1/30\`
    2. **Interface:**  ether7
3. Click the blue plus sign again to add another IP address
    1. **Address:** \`172.16.2.1/30\`
    2. **Interface:**  ether7.2
4. Click the blue plus sign again to add another IP address
    1. **Address:** \`172.16.3.1/30\`
    2. **Interface:**  ether7.3
5. Click the blue plus sign again to add another IP address
    1. **Address:** \`172.16.4.1/30\`
    2. **Interface:**  ether7.4
6. Click the blue plus sign again to add another IP address
    1. **Address:** \`172.16.5.1/30\`
    2. **Interface:**  ether7.5
7. Click the blue plus sign again to add another IP address
    1. **Address:** \`172.16.6.1/30\`
    2. **Interface:**  ether7.6
8. Click the blue plus sign again to add another IP address
      - **Address:** \`10.255.1.2\`
      - **Interface:** \`lo0\`

#### IPv6 Default Route

This should only be required if you are using Hetzner, or you have no default gateway installed for IPv6 traffic.

Note that the \`gateway\` may differ if you are not using Hetzner but require an IPv6 gateway.

1. Click IPv6 -> Routes
2. Click the blue plus sign
3. Enter the following details:
   1. Gateway: \`fe80::1%ether1\`
   2. Press OK

#### NAT

1. Click IP -> Firewall -> Click the NAT Tab
2. Click the blue plus icon.
3. Leave all the fields as their defaults, except for the *Out-Interface*, which we'll set to ether1
4. Select action tab, and change the *Action* from *Accept* to *Masquerade*
5. Press OK

#### Firewall

Really, firewalling entails a whole blog post of it's own, and not because we're setting up a firewall for Kubernetes, but because firewalls are actually pretty complicated devices.
This will be updated in the near-future with an article discussing firewalling.  

#### Routing Protocols

##### Routing Filters

We'll need some routing filters to ensure we don't propagate routes we don't want propagating, e.g. we don't want a default route from our back-end router, as our front-end router is the edge of our network. We'll also need to add explict allow rules for the routes we do want propagating.

Here are the list of rules we'll be adding. The left hand side is the chain, where the filter rule will reside, and the right hand side is the expression of the rule itself.

| Chain                                      | Rule                                               |
| ------------------------------------------ | -------------------------------------------------- |
| bgp-kubernetes.dingo.services-in           | accept;                                            |
| ospf-backbone-out-v4                       | if (dst == 95.216.46.64/26) \{ reject; \}            |
| ospf-backbone-out-v4                       | if (dst == 65.108.22.0/29) \{ reject; \}             |
| ospf-backbone-out-v4                       | if (dst == 65.108.23.64/29) \{ reject; \}            |
| ospf-backbone-out-v4                       | accept;                                            |
| ospf-backbone-in-v4                        | if (dst == 95.216.46.64/26) \{ reject; \}            |
| ospf-backbone-in-v4                        | if (dst == 0.0.0.0/0 ) \{ reject; \}                 |
| ospf-backbone-in-v4                        | accept;                                            |
| ospf-backbone-in-v4                        | if (dst == 95.216.46.70/32) \{ reject; \}            |
| ospf-backbone-in-v4                        | if (dst == 95.216.46.92/32) \{ reject; \}            |
| ospf-backbone-in-v4                        | if (dst == 65.108.22.2/32) \{ reject; \}             |
| ospf-backbone-in-v4                        | if (dst == 65.108.22.3/32) \{ reject; \}             |
| ospf-backbone-in-v4                        | if (dst == 65.108.22.4/32) \{ reject; \}             |
| ospf-backbone-out-v6                       | if (dst == 2a01:4f9:2a:2cb0::/64) \{ reject; \}      |
| ospf-backbone-out-v6                       | accept;                                            |
| ospf-backbone-in-v6                        | if (dst == 2a01:4f9:2a:2cb0::/64 ) \{ reject; \}     |
| ospf-backbone-in-v6                        | if (dst == ::/0 ) \{ reject; \}                      |
| ospf-backbone-in-v6                        | accept;                                            |

For each rule listed above:

   1. Click Routing -> Filters
   2. Click the blue plus sign. You should be greeted with a window with a dropdown field named \`chain\`, and a text field.
      3. For the \`chain\` filed, enter the corresponding chain of the rule that you are implementing from the above column.
      3. For the \`rule\` filed, enter the corresponding expression of the rule that you are implementing from the above column.
   3. Press OK

##### OSPF

We'll run OSPF on our front-end network, as so routes propagate automatically without needing to configure any static routes.

1. Click on Routing -> OSPF. A window will appear, which should be displaying the \`Instances\` tab

###### Instances

- **IPv4**

1. Click the blue plus icon
2. Enter the following details, then click *OK*
   - **Name:** \`backbone-v4\`
   - **Version:** \`2\`
   - **Out Filter:** \`ospf-backbone-out-v4\`
   - **In Filter:** \`ospf-backbone-in-v4\`
   - **Router ID:** \`10.255.1.1\`

- **IPv6**

1. Click the blue plus icon
2. Enter the following details, then click *OK*
   - **Name:** \`backbone-v6\`
   - **Version:** \`3\`
   - **Out Filter:** \`ospf-backbone-out-v6\`
   - **In Filter:** \`ospf-backbone-in-v6\`
   - **Router ID:** \`10.255.1.1\` (Note that IPv6 OSPF *cannot* use an IPv6 Router ID)

###### Areas

Now we'll create our areas. Since we have a pretty simple network topology, we'll only be leveraging the backbone area, 0.0.0.0.

1. Click on the *Areas* tab

- **IPv4**
   1. Click the blue plus icon
   2. Enter the following details, then click *OK*
      - **Name:** \`backbone-v4\`
      - **Instance:** \`backbone-v4\`
      - **Area ID:** \`0.0.0.0\`

- **IPv6**
   1. Click the blue plus icon
   2. Enter the following details, then click *OK*
      - **Name:** \`backbone-v6\`
      - **Instance:** \`backbone-v6\`
      - **Area ID:** \`0.0.0.0\`

###### Interface Templates

Now we'll create a template interface configuration, which will dynamically create an OSPF interface if the interface is running.

1. Click on the interface template tab

- **IPv4**

1. Click the blue plus icon
2. Enter the following details, then click *OK*
   - **Interfaces:** \`ether7\`
   - **Area:** \`backbone-v4\`
   - **Network Type:** \`ptp\` (\`broadcast\` will also work, \`ptp\` negates some network chitter chatter)
   - **Authentication:** \`MD5\`
   - **Auth Key:** \`abcdefghi\` (Pick a more secure key then this, this is documented as such to demostrate that the key is the same on both the front-end and back-end routers)
   - **Auth ID:** \`42\` (Again, not very important, but needs to match on both front-end and back-end routers)

- **IPv6**

1. Click the blue plus icon
2. Enter the following details, then click *OK*
   - **Interfaces:** \`ether7\`
   - **Area:** \`backbone-v6\`
   - **Network Type:** \`ptp\` (\`broadcast\` will also work, \`ptp\` negates some network chitter chatter)
   - **Authentication:** \`MD5\`
   - **Auth Key:** \`abcdefghi\` (Pick a more secure key then this, this is documented as such to demostrate that the key is the same on both the front-end and back-end routers)
   - **Auth ID:** \`42\` (Again, not very important, but needs to match on both front-end and back-end routers)

### Back-end Router

#### Identity

We'll rename the router to *back-end.routing.nic.dingo.services*

1. Click System -> Identity.
2. Rename to your desired name, we will be using *back-end.routing.nic.dingo.services*, then click OK.

#### Adjust MTU

1. Click interfaces, then select the ethernet tab.
2. Double click each interface, and set the MTU to 9000

#### Add Loopback Interface & Loopback Address

1. Click *Bridge*
2. Click the blue plus icon
3. Enter the following details and press *OK*
   - **Name:** \`lo0\`

#### IP Addresses

1. Click IP -> Addresses
2. Click the blue plus sign to add an IP address
3. Enter the following details:
   1. **Address:** 172.16.1.2/30
   2. **Interface:** ether2 (the last remaining interface, residing in the *Front-end .-. Backend* port group)
   3. Press *Comment*, and Type in *Back-end .-. Front-end Routing Network*
4. Click the blue plus sign to add an IP address
5. Enter the following details:
   1. **Address:** 10.3.0.254/22
   2. **Interface:** ether2 (the last remaining interface, residing in the *Front-end .-. Backend* port group)
   3. Press *Comment*, and Type in *Kubernetes Network*
6. Click the blue plus sign again to add another IP address
7. Enter the following details:
   1. **Address:** 10.0.0.254/29
   2. **Interface:** ether3
   3. Press *Comment*, and Type in *Storage Area Network*
8. Click the blue plus sign again to add another IP address
   1. Enter the following details and press *OK*
      - **Address:** \`10.255.1.2\`
      - **Network:** \`10.255.1.2\`
      - **Interface:** \`lo0\`

#### VLANs

1. Click Interfaces
2. Click the blue plus sign, then select *VLAN* to add a new VLAN.
3. For each VLAN required (one for each public address), undertake the following:
4. Name the VLAN *ether{x}.{vlan_number}*, for myself the first vlan will be ether7.2, and the last VLAN name will be ether7.6.
5. Configure the VLAN-ID to match the required VLAN.

For our build, the VLANs will be as follows:

- ether1 (Physical Interface, VLAN1, Native)
- ether1.2 (Physical Interface, VLAN2, Tagged)
- ether1.3 (Physical Interface, VLAN3, Tagged)
- ether1.4 (Physical Interface, VLAN4, Tagged)
- ether1.5 (Physical Interface, VLAN5, Tagged)
- ether1.6 (Physical Interface, VLAN6, Tagged)

#### DHCP Servers

##### Kubernetes Network

1. Click IP -> DHCP-Server
2. Press the *DHCP Setup* button
   1. A popup box will enquire which interface shall the DHCP server run on. Select ether2.
   2. The address space should automatically fill itself. Click next.
   3. The gateway should also be pre-populated. Click next.
   4. Let's define the address space manually. Delete the contents of the text box, and click the down arrow to the right of the text box to create new text boxes. Enter in the following:
      - 10.0.0.1
      - 10.0.1.1
      - 10.0.2.1
      - 10.0.3.1
        Press Next
   5. The prepopulated DNS Servers should be okay for now, later down the track we may replace these with our own resolvers. Click next.
   6. For the lease time, I configure two minutes as so DHCP changes can be enacted without too much waiting. However this is down to personal preference. Put your desired lease time and click next.

##### Storage Area Network

1. Click IP -> DHCP-Server
2. Press the *DHCP Setup* button
   1. A popup box will enquire which interface shall the DHCP server run on. Select ether3.
   2. The address space should automatically fill itself. Click next.
   3. The gateway should also be pre-populated. Click next.
   4. This time, let's leave the prepopulated address pool as it is. Press Next
   5. The prepopulated DNS Servers should be okay for now, later down the track we may replace these with our own resolvers. Click next.
   6. For the lease time, I configure two minutes as so DHCP changes can be enacted without too much waiting. However this is down to personal preference. Put your desired lease time and click next.

#### Routing Protocols

##### Routing Filters

We'll need some routing filters to ensure we don't propagate routes we don't want propagating, e.g. we don't want a default route from our back-end router, as our front-end router is the edge of our network. We'll also need to add explict allow rules for the routes we do want propagating.

Here are the list of rules we'll be adding. The left hand side is the chain, where the filter rule will reside, and the right hand side is the expression of the rule itself.

| Chain                                      | Rule                                               |
| ------------------------------------------ | -------------------------------------------------- |
| bgp-kubernetes.dingo.services-in           | accept;                                            |
| ospf-backbone-out-v4                       | if (dst == 95.216.46.70/32) \{ reject; \}            |
| ospf-backbone-out-v4                       | if (dst == 95.216.46.92/32) \{ reject; \}            |
| ospf-backbone-out-v4                       | if (dst == 65.108.22.2/32) \{ reject; \}             |
| ospf-backbone-out-v4                       | if (dst == 65.108.22.3/32) \{ reject; \}             |
| ospf-backbone-out-v4                       | if (dst == 65.108.22.4/32) \{ reject; \}             |
| ospf-backbone-out-v4                       | if (dst == 0.0.0.0/0) \{ reject; \}                  |
| ospf-backbone-out-v4                       | accept;                                            |
| ospf-backbone-in-v4                        | if (dst == 95.216.46.64/26) \{ reject; \}            |
| ospf-backbone-in-v4                        | if (dst == 65.108.22.0/29) \{ reject; \}             |
| ospf-backbone-in-v4                        | if (dst == 65.108.23.64/29) \{ reject; \}            |
| ospf-backbone-in-v4                        | accept;                                            |
| ospf-backbone-out-v6                       | if (dst == 2a01:4f9:2a:2cb0::/64) \{ reject; \}      |
| ospf-backbone-out-v6                       | if (dst == ::/0) \{ reject; \}                       |
| ospf-backbone-out-v6                       | accept;                                            |
| ospf-backbone-in-v6                        | if (dst == 2a01:4f9:2a:2cb0::/64 ) \{ reject; \}     |
| ospf-backbone-in-v6                        | accept;                                            |

For each rule listed above:

1. Click Routing -> Filters
2. Click the blue plus sign. You should be greeted with a window with a dropdown field named \`chain\`, and a text field.
3. For the \`chain\` filed, enter the corresponding chain of the rule that you are implementing from the above column.
4. For the \`rule\` filed, enter the corresponding expression of the rule that you are implementing from the above column.
5. Press OK

##### OSPF

We'll run OSPF on our back-end network, as so routes propagate automatically without needing to configure any static routes.

1. Click on Routing -> OSPF. A window will appear, which should be displaying the \`Instances\` tab

###### Instances

- **IPv4**

1. Click the blue plus icon
2. Enter the following details, then click *OK*
   - **Name:** \`backbone-v4\`
   - **Version:** \`2\`
   - **Out Filter:** \`ospf-backbone-out-v4\`
   - **In Filter:** \`ospf-backbone-in-v4\`
   - **Router ID:** \`10.255.1.2\`

- **IPv6**

1. Click the blue plus icon
2. Enter the following details, then click *OK*
   - **Name:** \`backbone-v6\`
   - **Version:** \`3\`
   - **Out Filter:** \`ospf-backbone-out-v6\`
   - **In Filter:** \`ospf-backbone-in-v6\`
   - **Router ID:** \`10.255.1.2\` (Note that IPv6 OSPF *cannot* use an IPv6 Router ID)

###### Areas

Now we'll create our areas. Since we have a pretty simple network topology, we'll only be leveraging the backbone area, 0.0.0.0.

1. Click on the *Areas* tab

- **IPv4**
   1. Click the blue plus icon
   2. Enter the following details, then click *OK*
      - **Name:** \`backbone-v4\`
      - **Instance:** \`backbone-v4\`
      - **Area ID:** \`0.0.0.0\`

- **IPv6**
   1. Click the blue plus icon
   2. Enter the following details, then click *OK*
      - **Name:** \`backbone-v6\`
      - **Instance:** \`backbone-v6\`
      - **Area ID:** \`0.0.0.0\`

###### Interface Templates

Now we'll create a template interface configuration, which will dynamically create an OSPF interface if the interface is running.

1. Click on the interface template tab

- **IPv4**

   1. Click the blue plus icon
   2. Enter the following details, then click *OK*
      - **Interfaces:** \`ether1\`
      - **Area:** \`backbone-v4\`
      - **Network Type:** \`ptp\` (\`broadcast\` will also work, \`ptp\` negates some network chitter chatter)
      - **Authentication:** \`MD5\`
      - **Auth Key:** \`abcdefghi\` (Pick a more secure key then this, this is documented as such to demostrate that the key is the same on both the front-end and back-end routers)
      - **Auth ID:** \`42\` (Again, not very important, but needs to match on both front-end and back-end routers)

- **IPv6**

   1. Click the blue plus icon
   2. Enter the following details, then click *OK*
      - **Interfaces:** \`ether1\`
      - **Area:** \`backbone-v6\`
      - **Network Type:** \`ptp\` (\`broadcast\` will also work, \`ptp\` negates some network chitter chatter)
      - **Authentication:** \`MD5\`
      - **Auth Key:** \`abcdefghi\` (Pick a more secure key then this, this is documented as such to demostrate that the key is the same on both the front-end and back-end routers)
      - **Auth ID:** \`42\` (Again, not very important, but needs to match on both front-end and back-end routers)

###### Neighbours

If you've followed this guide sequentially, you'll find that if you click on the *Neighbours* tab, you should see the front-end router listed with a state of \`full\`.
If this isn't the case, something has gone awfully wrong, and you should stop here and troubleshoot.

##### BGP

We'll leverage BGP to inject routes for our services configured within Kubernetes. This way, if there is a failure, the service address of the application is withdrawn, which is great for ensuring that we either get the expected outcome, or no outcome. No partially broken states!

1. Click *Routing -> BGP*, then click on the *Templates* tab.

###### Template

1. Click the blue plus icon
2. Enter the following details, then press *OK*
   1. On the *General* tab:
      - **Name:** \`MetalLB\`
      - **AS:** \`65534\`
      - **AFI:** \`ip, ipv6\`
      - **Router-ID:** \`10.3.0.254\`
   2. On the *Extra* tab:
      - **Default Originate:** \`Never\`
   3. On the *Filter* tab:
      - **Input Filter:** \`bgp-kubernetes.dingo.services-in\`
      - **Output Filter:** \`bgp-kubernetes.dingo.services-out\`

###### Connection

For each kubernetes node, we'll need to configure a connection in our back-end router

1. Click the blue plus icon
2. Enter the following details, then press *OK*
   - **Name:** \`metallb.a.control-node.k8s.dingo.services\`
   - **Template:** \`MetalLB\`
   - **Remote Address:** \`10.1.0.1/22\`
   - **Remote AS:** \`65534\`
   - **Local Role:** \`iBGP\`
3. Enter the following details, then press *OK*
   - **Name:** \`metallb.a.worker-node.k8s.dingo.services\`
   - **Template:** \`MetalLB\`
   - **Remote Address:** \`10.1.1.1/22\`
   - **Remote AS:** \`65534\`
   - **Local Role:** \`iBGP\`
4. Enter the following details, then press *OK*
   - **Name:** \`metallb.b.worker-node.k8s.dingo.services\`
   - **Template:** \`MetalLB\`
   - **Remote Address:** \`10.2.1.1/22\`
   - **Remote AS:** \`65534\`
   - **Local Role:** \`iBGP\`
5. Enter the following details, then press *OK*
   - **Name:** \`metallb.c.worker-node.k8s.dingo.services\`
   - **Template:** \`MetalLB\`
   - **Remote Address:** \`10.3.1.1/22\`
   - **Remote AS:** \`65534\`
   - **Local Role:** \`iBGP\`

        `,
    })

    console.log(JSON.stringify(lexicalJSON, null, 2))

    // const payloadUpdate = await payload.update({
    //     collection: "blog",
    //     id: "deploying-core-networking",
    //     data: { "content": JSON.stringify(lexicalJSON) }
    // })

    console.log(JSON.stringify(payloadUpdate))
    return (
        <div className='max-w-5xl mx-auto mt-8'>
            {/* <ToMarkdownForm submitFunction={onSubmit} /> */}
        </div>
    )

}