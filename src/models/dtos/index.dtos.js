import {
      SaveUserDTO,
      LoadUserDTO,
      GetUserDTO,
      UpdateUserDTO,
      DeleteUserDTO,
      LoadAdminDTO,
      CreateResetTokenDTO,
      ResetPasswordDTO
} from "./users/users.dto.js";

import {
      SaveProductDTO,
} from "./products/products.dto.js";

import {
      GetCartDTO,
      SaveCartDTO,
      AddProductDTO,
      DeleteProductFromCartDTO,
      PurchaseCartDTO
} from "./carts/carts.dto.js";

export const getDTOS = () => ({
      SaveUserDTO,
      LoadUserDTO,
      GetUserDTO,
      UpdateUserDTO,
      DeleteUserDTO,
      LoadAdminDTO,
      CreateResetTokenDTO,
      ResetPasswordDTO,
      GetCartDTO,
      SaveCartDTO,
      AddProductDTO,
      DeleteProductFromCartDTO,
      PurchaseCartDTO,
      SaveProductDTO,
});