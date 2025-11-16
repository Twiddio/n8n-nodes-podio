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

This node uses OAuth 2.0 authentication. To set up credentials:

1. **Create a Podio App**:
   - Log in to your Podio account
   - Go to Settings → Developer → API
   - Click "Create API Key" or "Register OAuth App"
   - Note your Client ID and Client Secret

2. **Configure OAuth in n8n**:
   - In n8n, add Podio credentials
   - Enter your Client ID and Client Secret
   - Complete the OAuth flow to authorize n8n to access your Podio account

The OAuth scopes included are:
- `app.read:app` - Read applications
- `app.write:app` - Write applications
- `item.read:app` - Read items
- `item.write:app` - Write items
- `task.read:task` - Read tasks
- `task.write:task` - Write tasks

For more information, see the [Podio API Authentication documentation](https://developers.podio.com/doc/authentication).

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
