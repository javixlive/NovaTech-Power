
## Diseño de entidad relacion

[![Entidad Relacion](https://i.ibb.co/6t61hKC/entidad-Relacion.jpg "Entidad Relacion")](https://i.ibb.co/6t61hKC/entidad-Relacion.jpg "Entidad Relacion")

## Models

- Carrito de compras.
- Facturas.
- Usuarios.
- Categorias.
- Reviews.
- Productos
- Roles

### Flujo de trabajo.

- Cada usuario tiene un carrito de compras por default, de esta forma al momento de registro se le asigna un carrito de compras.

- El carrito de compras tiene un status que por default esta en **"pending"** , al completar la factura el status cambiara a **"success"**, se creara un nuevo carrito y se actualizara el campo cartId del usuario correspondiente pasandole el nuevo id del carrito.

- Al completar la compra con paypal por parte del frontend, el backend recibira los siguientes datos: **CartId** , **Products** , **pagoId** , **userId**

- Al completar la compra como respuesta el front recibira todos los datos de la factura, incluyendo los **Productos**.

## Plugin de VSCODE

- [Todo Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight "Todo Highlight")


