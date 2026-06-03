export interface CompanyData {
  id: string;
  name: string;
  status: string;
  businessMapStatus: string;
}

export interface DepartmentData {
  id: string;
  departmentName: string;
  progress: number;
}

export interface ICompanyRepository {
  getDepartments(companyId: string): Promise<DepartmentData[]>;
  getCompany(companyId: string): Promise<CompanyData | null>;
  countUsersWithoutDepartment(companyId: string): Promise<number>;
  updateCompanyStatus(companyId: string, status: string): Promise<void>;
}
