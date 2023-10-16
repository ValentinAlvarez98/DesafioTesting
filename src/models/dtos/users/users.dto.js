import {
      createHash,
      compareHash
} from "../../../utils/bcrypt/bcrypt.utils.js";

import crypto from "crypto";

const validEmail = (email) => {

      const emailRegex = /^\w+([\.-]?\w+)*@(?:hotmail|outlook|gmail|coder|github)\.(?:|com|es)+$/i;

      return emailRegex.test(email);

};

export class GetUserDTO {

      constructor(payload) {

            const errors = [];

            if (!payload) errors.push("Se requiere un email");

            if (errors.length > 0) return {
                  errors: this.errors = errors
            };

            for (const key in payload) {

                  if (!payload[key]) errors.push(`Se requiere ${key}`);

            };

            if (payload.email !== undefined) {
                  if (!validEmail(payload.email)) errors.push("Se requiere un email valido");

            } else {
                  if (!validEmail(payload)) errors.push("Se requiere un email valido");
            }

            this.email = payload.email ? payload.email : payload;
            this.id = payload.id ? payload.id : '';
            this.password = payload.password ? payload.password : '';
            errors.length > 0 ? this.errors = errors : null;

      }

};

export class LoadUserDTO {

      constructor(payload, user) {

            const errors = [];

            if (!payload || !user) errors.push("El usuario que se intenta cargar, no existe");

            if (errors.length > 0) return {
                  errors: this.errors = errors
            };

            const executeValidation = payload.password && user ? true : false;

            if (executeValidation) {

                  const compare = compareHash(payload.password, user);

                  if (!compare) errors.push("Contraseña incorrecta");

            };

            if (!validEmail(user.email)) errors.push("Se requiere un email valido");

            this.email = user.email;
            this.id = user._id;
            this.age = user.age;
            this.first_name = user.first_name;
            this.last_name = user.last_name;
            this.phone = user.phone;
            this.role = user.role ? user.role.toUpperCase() : 'USER';
            errors.length > 0 ? this.errors = errors : null;

      };

};

export class SaveUserDTO {

      constructor(payload) {

            const errors = [];

            for (const key in payload) {

                  if (!payload[key] && key !== "phone") errors.push(`Se requiere ${key}`);

            };

            if (payload.password && payload.password.length < 8) errors.push("La contraseña debe tener al menos 8 caracteres");

            if (payload.password !== payload.confirm_password) errors.push("Las contraseñas no coinciden");

            if (!validEmail(payload.email)) errors.push("Se requiere un email valido");

            const hashedPassword = createHash(payload.password);

            this.first_name = payload.first_name;
            this.last_name = payload.last_name;
            this.email = payload.email.toLowerCase();
            this.age = payload.age;
            this.password = hashedPassword;
            this.role = payload.role ? payload.role.toUpperCase() : 'USER';
            this.phone = payload.phone;
            errors.length > 0 ? this.errors = errors : null;

      };

};

export class UpdateUserDTO {

      constructor(updatedPayload, payloadToUpdate) {

            const errors = [];

            if (updatedPayload.email && !validEmail(updatedPayload.email)) errors.push("Se requiere un email valido");

            if (updatedPayload.password && updatedPayload.password.length < 8) errors.push("La contraseña debe tener al menos 8 caracteres");

            if (!payloadToUpdate) errors.push("El usuario que se intenta modificar, no existe");

            if (errors.length > 0) return {
                  errors: this.errors = errors
            };

            const executeValidation = updatedPayload.password && payloadToUpdate ? true : false;

            if (executeValidation) {

                  const compare = compareHash(updatedPayload.password, payloadToUpdate);

                  if (!compare) errors.push("Contraseña incorrecta");

            };

            for (const key in updatedPayload) {

                  if (updatedPayload[key] && key !== "password" && key !== "_id") payloadToUpdate[key] = updatedPayload[key];

            };

            this._id = payloadToUpdate._id;
            this.first_name = payloadToUpdate.first_name;
            this.last_name = payloadToUpdate.last_name;
            this.email = payloadToUpdate.email;
            this.age = payloadToUpdate.age;
            this.password = payloadToUpdate.password;
            this.role = payloadToUpdate.role ? payloadToUpdate.role.toUpperCase() : 'USER';
            this.phone = payloadToUpdate.phone ? payloadToUpdate.phone : '';
            this.password_reset_token = payloadToUpdate.password_reset_token ? payloadToUpdate.password_reset_token : '';
            this.password_reset_expires = payloadToUpdate.password_reset_expires ? payloadToUpdate.password_reset_expires : '';
            errors.length > 0 ? this.errors = errors : null;

      }

}

export class DeleteUserDTO {

      constructor(payload, userToDelete) {

            const errors = [];

            if (!payload || !userToDelete) errors.push("El usuario que se intenta eliminar, no existe");

            if (errors.length > 0) return {
                  errors: this.errors = errors
            };

            if (!validEmail(payload.email)) errors.push("Se requiere un email valido");

            if (payload.password !== payload.confirm_password) errors.push("Las contraseñas no coinciden");

            const executeValidation = payload.password && userToDelete ? true : false;

            if (executeValidation) {

                  const compare = compareHash(payload.password, userToDelete);

                  if (!compare) errors.push("Contraseña incorrecta");

            };

            this.email = payload.email;
            this.password = payload.password;
            errors.length > 0 ? this.errors = errors : null;

      }

};

export class LoadAdminDTO {

      constructor(payload, admin) {

            const errors = [];

            if (!payload || !admin) errors.push("El usuario que se intenta cargar, no existe");

            if (errors.length > 0) return {
                  errors: this.errors = errors
            };

            for (const key in payload) {

                  if (!payload[key]) errors.push(`Se requiere ${key}`);

            };

            if (payload.email !== admin.email) errors.push("El usuario no existe");

            const executeValidation = payload.password && admin ? true : false;

            if (executeValidation) {

                  const compare = compareHash(payload.password, admin);

                  if (!compare) errors.push("Contraseña incorrecta");

            };

            this.email = admin.email;
            this.role = admin.role.toUpperCase();
            this.first_name = admin.first_name;
            this.last_name = admin.last_name;
            errors.length > 0 ? this.errors = errors : null;

      };

};

export class CreateResetTokenDTO {

      constructor(payload) {

            const errors = [];

            if (!payload) errors.push('El usuario que se intenta cargar, no existe')

            if (errors.length > 0) return {
                  errors: this.errors = errors
            };

            if (!validEmail(payload.email)) errors.push("Se requiere un email valido");

            const token = crypto.randomBytes(20).toString('hex');

            const expires = new Date();

            expires.setHours(expires.getHours() + 1);

            this.email = payload.email;
            this.first_name = payload.first_name;
            this.last_name = payload.last_name;
            this.email = payload.email;
            this.age = payload.age;
            this.role = payload.role ? payload.role.toUpperCase() : 'USER';
            this.phone = payload.phone;
            this.password = payload.password;
            this.password_reset_token = token;
            this.password_reset_expires = expires;
            errors.length > 0 ? this.errors = errors : null;

      };

}

export class ResetPasswordDTO {

      constructor(payload, user) {

            const errors = [];

            if (!payload || !user) errors.push('El usuario que se intenta cargar, no existe')

            if (errors.length > 0) return {
                  errors: this.errors = errors
            };

            if (!validEmail(payload.email)) errors.push("Se requiere un email valido");

            if (payload.password.length < 8) errors.push("La contraseña debe tener al menos 8 caracteres");

            if (payload.password !== payload.confirm_password) errors.push("Las contraseñas no coinciden");

            const executeValidation = payload.password && user.password ? true : false;

            if (executeValidation) {

                  const compare = compareHash(payload.password, user);

                  if (compare) errors.push("La contraseña no puede ser igual a la anterior");

            };

            const hashedPassword = createHash(payload.password);

            this.email = user.email;
            this.first_name = user.first_name;
            this.last_name = user.last_name;
            this.email = user.email;
            this.age = user.age;
            this.role = user.role ? user.role.toUpperCase() : 'USER';
            this.phone = user.phone;
            this.password = hashedPassword;
            this.passwordResetToken = user.passwordResetToken;
            this.passwordResetExpires = user.passwordResetExpires;
            errors.length > 0 ? this.errors = errors : null;

      }

}