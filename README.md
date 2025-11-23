# n8n-nodes-podio

This is an n8n community node. It lets you use Podio in your n8n workflows.

Podio is a collaboration platform that helps teams organize work, communicate, and get things done.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Item
- **Get** - Get a single item by ID
- **Get Many** - Get multiple items from an application with filtering and pagination
- **Create** - Create a new item in an application
- **Update** - Update an existing item
- **Delete** - Delete an item

### Application
- **Get** - Get a single application by ID
- **Get Many** - Get multiple applications from a workspace

### Workspace
- **Get** - Get a single workspace by ID
- **Get Many** - Get multiple workspaces

## Credentials

This node uses Username & Password authentication as described in the [Podio Username & Password authentication documentation](https://developers.podio.com/authentication/username_password).

To set up credentials:

1. **Get your API credentials**:
   - Log in to your Podio account
   - Go to Settings → Developer → API
   - Note your Client ID and Client Secret

2. **Configure credentials in n8n**:
   - In n8n, add Podio Username & Password API credentials
   - Enter your Client ID, Client Secret, Username (email), and Password
   - Click "Test" to verify your credentials are working correctly

For more information, see the [Podio API Authentication documentation](https://developers.podio.com/doc/authentication) and [Username & Password flow](https://developers.podio.com/authentication/username_password).

## Compatibility

This node requires n8n version 1.0.0 or higher.

## Usage

### Creating Items

When creating items, you'll need to provide:
1. **Application ID** - Select from the dropdown or enter manually
2. **Fields** - Add field values using Field ID and Value pairs

Field IDs can be found in your Podio application settings or by inspecting the application structure via the API.

### Dynamic Field Selection

The node supports dynamic dropdowns for:
- **Workspaces** - Automatically populated from your account
- **Applications** - Filtered by selected workspace
- **Items** - Filtered by selected application

### Pagination

For "Get Many" operations, you can:
- Set a limit (1-500 items)
- Use "Return All" to fetch all results with automatic pagination

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Podio API Documentation](https://developers.podio.com/doc)
- [Podio Authentication Guide](https://developers.podio.com/doc/authentication)
