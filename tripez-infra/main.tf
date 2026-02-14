module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = var.cluster_name
  cidr = var.vpc_cidr
  azs  = ["${var.region}a", "${var.region}b"]

  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "tripez-vpc"
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.29"
  subnet_ids      = module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id

  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    default = {
      desired_size = 3
      max_size     = 4
      min_size     = 1

      instance_types = ["t3.micro"]
      capacity_type  = "ON_DEMAND"
    }
  }

  tags = {
    Name = "tripez-eks"
  }
}
