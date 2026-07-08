// Serializa BigInt como number en las respuestas JSON. Cubre el caso de
// $queryRaw con COUNT/agregaciones crudas (Prisma devuelve BigInt ahí) sin
// costo por request. El cliente normal de Prisma no genera BigInt.
// Se importa una sola vez en main.ts, antes de arrancar la app.

(BigInt.prototype as unknown as { toJSON: () => number }).toJSON = function () {
  return Number(this);
};
