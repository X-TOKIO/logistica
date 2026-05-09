import { Injectable, ConflictException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Categoria } from './entities/categoria.entity';
import { UMedida } from './entities/u-medida.entity';
import { Almacen } from './entities/almacen.entity';
import { Sucursal } from './entities/sucursal.entity';
import { Producto } from './entities/producto.entity';
import { ProductoAlmacen } from './entities/producto-almacen.entity';

import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/create-categoria.dto';
import { CreateMedidaDto, UpdateMedidaDto } from './dto/create-medida.dto';
import { CreateAlmacenDto, UpdateAlmacenDto } from './dto/create-almacen.dto';
import { CreateSucursalDto, UpdateSucursalDto } from './dto/create-sucursal.dto';
import { CreateProductoDto, UpdateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class WarehouseService implements OnModuleInit {
  constructor(
    @InjectRepository(Categoria)       private catRepo: Repository<Categoria>,
    @InjectRepository(UMedida)         private medRepo: Repository<UMedida>,
    @InjectRepository(Almacen)         private almRepo: Repository<Almacen>,
    @InjectRepository(Sucursal)        private sucRepo: Repository<Sucursal>,
    @InjectRepository(Producto)        private prodRepo: Repository<Producto>,
    @InjectRepository(ProductoAlmacen) private prodAlmRepo: Repository<ProductoAlmacen>,
  ) {}

  // ─── Seed inicial de nodos PARADISO ──────────────────────────────────────

  async onModuleInit() {
    const sucursalSeed = [
      { Nombre: 'PARADISO — FABRIL',  Direccion: 'Santa Cruz, Bolivia', Latitud: -17.330885, Longitud: -63.248443, Color: '#f59e0b', Tipo: 'almacen' },
      { Nombre: 'PARADISO — Betania', Direccion: 'Santa Cruz, Bolivia', Latitud: -17.348671, Longitud: -63.232710, Color: '#10b981', Tipo: 'sucursal' },
      { Nombre: 'PARADISO — Warnes',  Direccion: 'Warnes, Santa Cruz',  Latitud: -17.511309, Longitud: -63.167547, Color: '#3b82f6', Tipo: 'sucursal' },
      { Nombre: 'PARADISO — Loza',    Direccion: 'Santa Cruz, Bolivia', Latitud: -17.749364, Longitud: -63.178861, Color: '#ec4899', Tipo: 'sucursal' },
      { Nombre: 'PARADISO — Pirai',   Direccion: 'Santa Cruz, Bolivia', Latitud: -17.792079, Longitud: -63.198675, Color: '#f97316', Tipo: 'sucursal' },
      { Nombre: 'PARADISO — Tokio',   Direccion: 'Santa Cruz, Bolivia', Latitud: -17.717678, Longitud: -63.162393, Color: '#14b8a6', Tipo: 'sucursal' },
    ];

    for (const s of sucursalSeed) {
      const exists = await this.sucRepo.findOne({ where: { Nombre: s.Nombre }, withDeleted: true });
      if (!exists) await this.sucRepo.save(this.sucRepo.create(s));
    }

    const almacenSeed = [
      { Nombre: 'PARADISO — Almacén Central', Direccion: 'Santa Cruz, Bolivia', Latitud: -17.764656, Longitud: -63.204454, Color: '#6366f1' },
    ];

    for (const a of almacenSeed) {
      const exists = await this.almRepo.findOne({ where: { Nombre: a.Nombre }, withDeleted: true });
      if (!exists) await this.almRepo.save(this.almRepo.create(a));
    }
  }

  // ─── Categorías ───────────────────────────────────────────────────────────

  async getCategorias() {
    return this.catRepo.find({ order: { NombreC: 'ASC' } });
  }

  async createCategoria(dto: CreateCategoriaDto) {
    const exists = await this.catRepo.findOne({ where: { NombreC: dto.NombreC } });
    if (exists) throw new ConflictException(`Categoría "${dto.NombreC}" ya existe.`);
    return this.catRepo.save(this.catRepo.create(dto));
  }

  async updateCategoria(id: number, dto: UpdateCategoriaDto) {
    const cat = await this.catRepo.findOne({ where: { ID_Categoria: id } });
    if (!cat) throw new NotFoundException('Categoría no encontrada.');
    if (dto.NombreC && dto.NombreC !== cat.NombreC) {
      const dup = await this.catRepo.findOne({ where: { NombreC: dto.NombreC } });
      if (dup) throw new ConflictException(`Categoría "${dto.NombreC}" ya existe.`);
    }
    await this.catRepo.update(id, dto);
    return this.catRepo.findOne({ where: { ID_Categoria: id } });
  }

  async deleteCategoria(id: number) {
    const cat = await this.catRepo.findOne({ where: { ID_Categoria: id } });
    if (!cat) throw new NotFoundException('Categoría no encontrada.');
    await this.catRepo.softDelete(id);
    return { success: true };
  }

  // ─── Unidades de Medida ───────────────────────────────────────────────────

  async getMedidas() {
    return this.medRepo.find({ order: { Nombre: 'ASC' } });
  }

  async createMedida(dto: CreateMedidaDto) {
    if (!dto.factor_conversion || dto.factor_conversion <= 1) {
      dto.factor_conversion = this.parseFactor(dto.Unidades_Bulto);
    }
    return this.medRepo.save(this.medRepo.create(dto));
  }

  async updateMedida(id: number, dto: UpdateMedidaDto) {
    const med = await this.medRepo.findOne({ where: { ID_Medida: id } });
    if (!med) throw new NotFoundException('Unidad de medida no encontrada.');
    if (dto.Unidades_Bulto && (!dto.factor_conversion || dto.factor_conversion <= 1)) {
      dto.factor_conversion = this.parseFactor(dto.Unidades_Bulto);
    }
    await this.medRepo.update(id, dto);
    return this.medRepo.findOne({ where: { ID_Medida: id } });
  }

  async deleteMedida(id: number) {
    const med = await this.medRepo.findOne({ where: { ID_Medida: id } });
    if (!med) throw new NotFoundException('Unidad de medida no encontrada.');
    await this.medRepo.softDelete(id);
    return { success: true };
  }

  // ─── Almacenes ────────────────────────────────────────────────────────────

  async getAlmacenes() {
    return this.almRepo.find({ order: { Nombre: 'ASC' } });
  }

  async createAlmacen(dto: CreateAlmacenDto) {
    return this.almRepo.save(this.almRepo.create(dto));
  }

  async updateAlmacen(id: number, dto: UpdateAlmacenDto) {
    const alm = await this.almRepo.findOne({ where: { ID_Almacen: id } });
    if (!alm) throw new NotFoundException('Almacén no encontrado.');
    await this.almRepo.update(id, dto);
    return this.almRepo.findOne({ where: { ID_Almacen: id } });
  }

  async deleteAlmacen(id: number) {
    const alm = await this.almRepo.findOne({ where: { ID_Almacen: id } });
    if (!alm) throw new NotFoundException('Almacén no encontrado.');
    await this.almRepo.softDelete(id);
    return { success: true };
  }

  // ─── Sucursales ───────────────────────────────────────────────────────────

  async getSucursales() {
    return this.sucRepo.find({ order: { Nombre: 'ASC' } });
  }

  async createSucursal(dto: CreateSucursalDto) {
    return this.sucRepo.save(this.sucRepo.create(dto));
  }

  async updateSucursal(id: number, dto: UpdateSucursalDto) {
    const suc = await this.sucRepo.findOne({ where: { ID_Sucursal: id } });
    if (!suc) throw new NotFoundException('Sucursal no encontrada.');
    await this.sucRepo.update(id, dto);
    return this.sucRepo.findOne({ where: { ID_Sucursal: id } });
  }

  async deleteSucursal(id: number) {
    const suc = await this.sucRepo.findOne({ where: { ID_Sucursal: id } });
    if (!suc) throw new NotFoundException('Sucursal no encontrada.');
    await this.sucRepo.softDelete(id);
    return { success: true };
  }

  // ─── Productos ────────────────────────────────────────────────────────────

  async getProductos(search?: string, categoriaId?: number, almacenId?: number) {
    const qb = this.prodRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.categoria', 'cat')
      .leftJoinAndSelect('p.medida', 'med')
      .leftJoinAndSelect('p.productoAlmacenes', 'pa');

    if (search) {
      qb.andWhere('(p.Nombre ILIKE :s OR p.CodigoBarra ILIKE :s)', { s: `%${search}%` });
    }
    if (categoriaId) {
      qb.andWhere('p.ID_Categoria = :catId', { catId: categoriaId });
    }
    if (almacenId) {
      // Alias 'pa_filter' distinto del 'pa' ya usado en leftJoinAndSelect
      qb.innerJoin(ProductoAlmacen, 'pa_filter',
        'pa_filter.ID_Producto = p.ID_Producto AND pa_filter.ID_Almacen = :almId',
        { almId: almacenId },
      );
    }

    const productos = await qb.orderBy('p.Nombre', 'ASC').getMany();
    return productos;
  }

  async getProductoById(id: number) {
    const p = await this.prodRepo.findOne({
      where: { ID_Producto: id },
      relations: ['categoria', 'medida'],
    });
    if (!p) throw new NotFoundException('Producto no encontrado.');
    const stocks = await this.prodAlmRepo.find({
      where: { ID_Producto: id },
      relations: ['almacen'],
    });
    return { ...p, stocks };
  }

  async createProducto(dto: CreateProductoDto) {
    if (dto.CodigoBarra) {
      const exists = await this.prodRepo.findOne({ where: { CodigoBarra: dto.CodigoBarra } });
      if (exists) throw new ConflictException(`Código de barras "${dto.CodigoBarra}" ya está registrado.`);
    }
    const prod = await this.prodRepo.save(this.prodRepo.create(dto));

    // Inicializar stock = 0 en todos los almacenes existentes
    const almacenes = await this.almRepo.find();
    if (almacenes.length > 0) {
      await this.prodAlmRepo.save(
        almacenes.map(a => ({ ID_Producto: prod.ID_Producto, ID_Almacen: a.ID_Almacen, Stock_Actual: 0 }))
      );
    }
    return this.getProductoById(prod.ID_Producto);
  }

  async updateProducto(id: number, dto: UpdateProductoDto) {
    const prod = await this.prodRepo.findOne({ where: { ID_Producto: id } });
    if (!prod) throw new NotFoundException('Producto no encontrado.');
    if (dto.CodigoBarra && dto.CodigoBarra !== prod.CodigoBarra) {
      const dup = await this.prodRepo.findOne({ where: { CodigoBarra: dto.CodigoBarra } });
      if (dup) throw new ConflictException(`Código de barras "${dto.CodigoBarra}" ya está registrado.`);
    }
    await this.prodRepo.update(id, dto);
    return this.getProductoById(id);
  }

  async deleteProducto(id: number) {
    const prod = await this.prodRepo.findOne({ where: { ID_Producto: id } });
    if (!prod) throw new NotFoundException('Producto no encontrado.');
    await this.prodRepo.softDelete(id);
    return { success: true };
  }

  // ─── Export PDF ───────────────────────────────────────────────────────────

  // ─── Helpers privados ─────────────────────────────────────────────────────

  private parseFactor(unidadesBulto?: string): number {
    if (!unidadesBulto) return 1;
    const m = unidadesBulto.match(/[xX×*](\d+)/);
    if (m) return Math.max(1, parseInt(m[1], 10));
    const n = parseInt(unidadesBulto, 10);
    return isNaN(n) ? 1 : Math.max(1, n);
  }

  async exportProductosPdf(
    search?: string,
    categoriaId?: number,
    almacenId?: number,
    username?: string,
  ): Promise<Buffer> {
    const items = await this.getProductos(search, categoriaId, almacenId);

    const catLabel = categoriaId
      ? (await this.catRepo.findOne({ where: { ID_Categoria: categoriaId } }))?.NombreC ?? 'Desconocida'
      : 'Todas';
    const almLabel = almacenId
      ? (await this.almRepo.findOne({ where: { ID_Almacen: almacenId } }))?.Nombre ?? 'Desconocido'
      : 'Todos';

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PDFDocument = require('pdfkit');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pathMod = require('path');

    const logoPath = pathMod.resolve(process.cwd(), '../frontend/public/logo-paradiso.png');
    const hasLogo = fs.existsSync(logoPath);

    // ── Layout ───────────────────────────────────────────────────────────────
    const PW = 595.28, PH = 841.89;
    const M  = 35;
    // Column widths: CÓDIGO | PRODUCTO | CATEGORÍA | MEDIDA | PRECIO | EXISTENCIAS
    const CW  = [65, 175, 85, 50, 65, 85]; // sum = 525
    const TW  = CW.reduce((a, b) => a + b, 0);
    const COL: number[] = [];
    let colX = M;
    for (const w of CW) { COL.push(colX); colX += w; }

    const HDR_H  = 78;  // page header height
    const THDR_H = 22;  // table header height
    const ROW_H  = 55;  // product row height
    const FOOT_Y = PH - M - 20;

    // Y positions for first-page title block
    const tyTitle    = HDR_H + 8;
    const tySubtitle = tyTitle + 26;
    const tyDivider  = tySubtitle + 18;
    const tyFilter   = tyDivider + 9;
    const tyTableHdr = tyFilter + 15;
    const Y_ROW1     = tyTableHdr + THDR_H;
    const Y_ROW_N    = HDR_H + THDR_H;

    const ROWS_P1 = Math.floor((FOOT_Y - 10 - Y_ROW1) / ROW_H);
    const ROWS_PN = Math.floor((FOOT_Y - 10 - Y_ROW_N) / ROW_H);
    const totalPages = items.length === 0 ? 1
      : items.length <= ROWS_P1 ? 1
      : 1 + Math.ceil((items.length - ROWS_P1) / ROWS_PN);

    // ── Palette ──────────────────────────────────────────────────────────────
    const DARK    = '#0f172a';
    const MID     = '#1e293b';
    const GRAY    = '#64748b';
    const LGRAY   = '#94a3b8';
    const BORDER  = '#e2e8f0';
    const ROW_ALT = '#f8fafc';
    const AMBER   = '#d97706';
    const AMBERBG = '#fef3c7';
    const GREEN   = '#059669';
    const GREENBG = '#d1fae5';
    const RED     = '#dc2626';
    const REDBG   = '#fee2e2';
    const CATBG   = '#f0fdf4';
    const CATBDR  = '#86efac';
    const CATCLR  = '#166534';

    const doc = new PDFDocument({ margin: 0, size: 'A4', autoFirstPage: true });
    const chunks: Buffer[] = [];
    let pageNum = 0;
    const now     = new Date();
    const dateStr = now.toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });

    // ── Badge ────────────────────────────────────────────────────────────────
    const drawBadge = (txt: string, x: number, y: number, w: number, bg: string, tc: string, bc?: string) => {
      doc.lineWidth(0.5);
      if (bc) {
        doc.roundedRect(x, y, w, 14, 3).fillAndStroke(bg, bc);
      } else {
        doc.roundedRect(x, y, w, 14, 3).fill(bg);
      }
      doc.fillColor(tc).fontSize(6.5).font('Helvetica-Bold')
         .text(txt, x + 2, y + 3.5, { width: w - 4, align: 'center', lineBreak: false });
    };

    // ── Page header ──────────────────────────────────────────────────────────
    const drawPageHeader = () => {
      pageNum++;
      if (hasLogo) {
        try { doc.image(logoPath, M, 11, { width: 56, height: 56 }); } catch {}
      }
      const IX = PW - M - 200;
      const IW = 200;
      doc.fillColor(DARK).fontSize(10).font('Helvetica-Bold')
         .text('INFORME DE INVENTARIO', IX, 13, { width: IW, align: 'right', lineBreak: false });
      doc.fillColor(GRAY).fontSize(7.5).font('Helvetica')
         .text(`Fecha de Emisión: ${dateStr}  ${timeStr}`, IX, 31, { width: IW, align: 'right', lineBreak: false })
         .text(`Generado por: ${username ?? 'Sistema de Productos'}`, IX, 43, { width: IW, align: 'right', lineBreak: false })
         .text(`Página: ${pageNum} de ${totalPages}`, IX, 55, { width: IW, align: 'right', lineBreak: false });
      doc.moveTo(M, HDR_H).lineTo(M + TW, HDR_H).strokeColor(BORDER).lineWidth(0.5).stroke();
    };

    // ── Table header row ─────────────────────────────────────────────────────
    const drawTableHdr = (y: number): number => {
      doc.rect(M, y, TW, THDR_H).fill(MID);
      const heads = ['CÓDIGO', 'PRODUCTO', 'CATEGORÍA', 'MEDIDA', 'PRECIO (Bs.)', 'EXISTENCIAS'];
      heads.forEach((h, i) => {
        doc.fillColor('#e2e8f0').fontSize(6.5).font('Helvetica-Bold')
           .text(h, COL[i] + 3, y + 8, { width: CW[i] - 6, align: i >= 4 ? 'center' : 'left', lineBreak: false });
      });
      return y + THDR_H;
    };

    // ── Page footer ──────────────────────────────────────────────────────────
    const drawFooter = () => {
      doc.moveTo(M, FOOT_Y - 5).lineTo(M + TW, FOOT_Y - 5).strokeColor(BORDER).lineWidth(0.5).stroke();
      doc.fillColor(LGRAY).fontSize(7).font('Helvetica')
         .text(
           `PARADISO Logistics © ${now.getFullYear()}  ·  ${items.length} producto${items.length !== 1 ? 's' : ''}`,
           M, FOOT_Y, { width: TW, align: 'center', lineBreak: false },
         );
    };

    return new Promise((resolve, reject) => {
      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end',  () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ── First page header + title block ──────────────────────────────────
      drawPageHeader();

      doc.fillColor(DARK).fontSize(18).font('Helvetica-Bold')
         .text('Catálogo de Productos', M, tyTitle, { width: TW, align: 'center', lineBreak: false });
      doc.fillColor(GRAY).fontSize(8.5).font('Helvetica')
         .text('Listado Maestro de Artículos, Precios y Existencias por Almacén',
           M, tySubtitle, { width: TW, align: 'center', lineBreak: false });
      doc.moveTo(M, tyDivider).lineTo(M + TW, tyDivider).strokeColor(BORDER).lineWidth(0.5).stroke();
      doc.fillColor(LGRAY).fontSize(7.5).font('Helvetica')
         .text(`Filtros aplicados:  Categoría (${catLabel}),  Almacén (${almLabel})`,
           M, tyFilter, { lineBreak: false });

      let y = drawTableHdr(tyTableHdr);

      // ── Product rows ──────────────────────────────────────────────────────
      items.forEach((prod: any, idx: number) => {
        if (y + ROW_H > FOOT_Y - 10) {
          drawFooter();
          doc.addPage();
          drawPageHeader();
          y = drawTableHdr(HDR_H);
        }

        const rowBg = idx % 2 === 0 ? ROW_ALT : '#ffffff';
        doc.rect(M, y, TW, ROW_H).fill(rowBg);
        doc.moveTo(M, y + ROW_H).lineTo(M + TW, y + ROW_H).strokeColor(BORDER).lineWidth(0.3).stroke();

        const midY = y + ROW_H / 2;

        // ── CÓDIGO ───────────────────────────────────────────────────────
        doc.fillColor(GRAY).fontSize(6).font('Helvetica')
           .text(prod.CodigoBarra ?? '—', COL[0] + 3, midY - 4, {
             width: CW[0] - 6, lineBreak: false, ellipsis: true,
           });

        // ── PRODUCTO (imagen + nombre + descripción) ──────────────────────
        const IMG_SZ = 40;
        const imgX   = COL[1] + 5;
        const imgY   = y + (ROW_H - IMG_SZ) / 2;

        let imgLoaded = false;
        if (prod.Image) {
          try {
            const imgFile = pathMod.resolve(process.cwd(), prod.Image.replace(/^\//, ''));
            if (fs.existsSync(imgFile)) {
              doc.image(imgFile, imgX, imgY, { fit: [IMG_SZ, IMG_SZ] });
              imgLoaded = true;
            }
          } catch {}
        }
        if (!imgLoaded) {
          doc.roundedRect(imgX, imgY, IMG_SZ, IMG_SZ, 3).fill('#e2e8f0');
          doc.fillColor(LGRAY).fontSize(5).font('Helvetica')
             .text('SIN\nIMG', imgX, imgY + IMG_SZ / 2 - 6, { width: IMG_SZ, align: 'center', lineBreak: true });
        }

        const txtX = imgX + IMG_SZ + 6;
        const txtW = CW[1] - 5 - IMG_SZ - 10;
        doc.fillColor(DARK).fontSize(7.5).font('Helvetica-Bold')
           .text(prod.Nombre, txtX, y + 8, { width: txtW, lineBreak: false, ellipsis: true });
        if (prod.Descripcion) {
          doc.fillColor(GRAY).fontSize(5.5).font('Helvetica')
             .text(prod.Descripcion, txtX, y + 20, { width: txtW, height: 24, lineBreak: true });
        }

        // ── CATEGORÍA ────────────────────────────────────────────────────
        const catTxt = prod.categoria?.NombreC ?? '—';
        const catW   = Math.min(CW[2] - 14, Math.max(28, catTxt.length * 4.2 + 12));
        const catX   = COL[2] + (CW[2] - catW) / 2;
        drawBadge(catTxt, catX, midY - 7, catW, CATBG, CATCLR, CATBDR);

        // ── MEDIDA ───────────────────────────────────────────────────────
        const medTxt = prod.medida?.Abreviatura ?? '—';
        doc.fillColor(DARK).fontSize(7).font('Helvetica')
           .text(medTxt, COL[3] + 3, midY - 4, { width: CW[3] - 6, align: 'center', lineBreak: false });

        // ── PRECIO ───────────────────────────────────────────────────────
        const factor = prod.medida?.factor_conversion ?? 1;
        const pUnit  = Number(prod.PrecioUnitario);
        const pCaja  = pUnit * factor;

        if (factor > 1) {
          doc.fillColor(DARK).fontSize(7.5).font('Helvetica-Bold')
             .text(`Bs. ${pUnit.toFixed(2)}`, COL[4] + 3, midY - 10, {
               width: CW[4] - 6, align: 'center', lineBreak: false,
             });
          doc.fillColor(GRAY).fontSize(5.5).font('Helvetica')
             .text(`Caja: Bs. ${pCaja.toFixed(2)}`, COL[4] + 3, midY + 2, {
               width: CW[4] - 6, align: 'center', lineBreak: false,
             });
        } else {
          doc.fillColor(DARK).fontSize(7.5).font('Helvetica-Bold')
             .text(`Bs. ${pUnit.toFixed(2)}`, COL[4] + 3, midY - 4, {
               width: CW[4] - 6, align: 'center', lineBreak: false,
             });
        }

        // ── EXISTENCIAS ──────────────────────────────────────────────────
        const total = (prod.productoAlmacenes ?? [])
          .reduce((s: number, e: any) => s + Number(e.Stock_Actual), 0);
        const paq = factor > 1 ? Math.floor(total / factor) : 0;
        const uds = Math.round(total);
        const bW  = CW[5] - 18;
        const bX  = COL[5] + 9;

        if (factor > 1) {
          drawBadge(`${paq} Paq.`, bX, midY - 17, bW, AMBERBG, AMBER);
          drawBadge(`${uds} Uds.`, bX, midY - 1, bW,
            uds > 0 ? GREENBG : REDBG, uds > 0 ? GREEN : RED);
        } else {
          drawBadge(`${uds} Uds.`, bX, midY - 7, bW,
            uds > 0 ? GREENBG : REDBG, uds > 0 ? GREEN : RED);
        }

        y += ROW_H;
      });

      // Empty state
      if (items.length === 0) {
        doc.fillColor(GRAY).fontSize(9).font('Helvetica')
           .text('No se encontraron productos con los filtros seleccionados.',
             M, Y_ROW1 + 20, { width: TW, align: 'center', lineBreak: false });
      }

      drawFooter();
      doc.end();
    });
  }
}
