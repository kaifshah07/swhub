import { prisma } from "../../config/database";

export class BannerService {

  static async create(data:any){

      return prisma.banner.create({

          data

      });

  }

  static async getAll(){

      return prisma.banner.findMany({

          orderBy:{

              displayOrder:"asc"

          }

      });

  }

  static async getById(id:number){

      return prisma.banner.findUnique({

          where:{id}

      });

  }

  static async update(id:number,data:any){

      return prisma.banner.update({

          where:{id},

          data

      });

  }

  static async delete(id:number){

      return prisma.banner.delete({

          where:{id}

      });

  }

}