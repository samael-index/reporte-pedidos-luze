create table materiales (
  id bigint generated always as identity primary key,
  nombre text not null,
  unidad text not null check (unidad in ('g', 'ml', 'unidad', 'metro')),
  costo_unitario numeric not null default 0
);

create table pedidos (
  id bigint generated always as identity primary key,
  cliente text not null,
  telefono text,
  producto text,
  anotacion text,
  fecha_entrada date not null default current_date,
  fecha_entrega date,
  total numeric not null default 0,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'en producción', 'listo', 'entregado'))
);

create table pedido_materiales (
  id bigint generated always as identity primary key,
  pedido_id bigint not null references pedidos on delete cascade,
  material_id bigint not null references materiales,
  cantidad numeric not null
);

create table abonos (
  id bigint generated always as identity primary key,
  pedido_id bigint not null references pedidos on delete cascade,
  valor numeric not null,
  fecha date not null default current_date
);

alter table materiales enable row level security;
alter table pedidos enable row level security;
alter table pedido_materiales enable row level security;
alter table abonos enable row level security;

create view pedidos_calc with (security_invoker = on) as
select
  p.*,
  coalesce(c.costo, 0) as costo,
  p.total - coalesce(c.costo, 0) as ganancia,
  coalesce(a.abonado, 0) as abonado,
  p.total - coalesce(a.abonado, 0) as saldo
from pedidos p
left join (
  select pm.pedido_id, sum(pm.cantidad * m.costo_unitario) as costo
  from pedido_materiales pm
  join materiales m on m.id = pm.material_id
  group by pm.pedido_id
) c on c.pedido_id = p.id
left join (
  select pedido_id, sum(valor) as abonado from abonos group by pedido_id
) a on a.pedido_id = p.id;

insert into pedidos (cliente, producto, anotacion, fecha_entrada, fecha_entrega, total) values
  ('Loraines', '12 ramos', 'Domicilio', '2026-10-31', '2026-11-30', 294000),
  ('Leonor', '12 kits sencillos', 'Domicilio, vela vaso por confirmar', '2026-11-01', null, 171600),
  ('Stefania', '50 recordatorios Primera comunión', 'Entrega en local', '2026-11-05', '2026-11-13', 175000),
  ('Alexandra', '1 vela lata + girasol + maracuyá', null, '2026-11-07', '2026-11-13', 28000),
  ('Amor de pelos', '3 vírgenes grandes', '2 color hueso, 1 color amarillo', '2026-11-09', '2026-11-14', 45000);

insert into abonos (pedido_id, valor, fecha)
select id, 200000, fecha_entrada from pedidos where cliente = 'Loraines'
union all
select id, 87500, fecha_entrada from pedidos where cliente = 'Stefania';
