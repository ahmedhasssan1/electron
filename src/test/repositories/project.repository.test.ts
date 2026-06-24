import { ProjectRepository } from '../../repositories/project.repository';
import { Project, ProjectStatus } from '../../models/Project';
import { AppDataSource } from '../../config/database';
import { Repository } from 'typeorm';

jest.mock('../../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const makeProject = (overrides: Partial<Project> = {}): Project =>
  ({
    id: 1,
    title: 'Default Project',
    description: 'A test project',
    status: ProjectStatus.TODO,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as unknown as Project;

describe('ProjectRepository', () => {
  let repository: ProjectRepository;
  let mockRepo: jest.Mocked<
    Pick<
      Repository<Project>,
      'findAndCount' | 'findOneBy' | 'create' | 'save' | 'merge' | 'delete'
    >
  >;

  beforeEach(() => {
    mockRepo = {
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    repository = new ProjectRepository();
  });

  describe('findAll', () => {
    it('should return paginated results with correct meta', async () => {
      const projects = [
        makeProject({ id: 1, title: 'Project A' }),
        makeProject({ id: 2, title: 'Project B' }),
      ];
      mockRepo.findAndCount.mockResolvedValue([projects, 15]);

      const result = await repository.findAll(
        {},
        { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'ASC' },
      );

      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 15,
        totalPages: 2,
        hasNextPage: true,
        hasPrevPage: false,
      });
      expect(mockRepo.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'ASC' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findById', () => {
    it('should return a project when found', async () => {
      const project = makeProject({ id: 1, title: 'Test' });
      mockRepo.findOneBy.mockResolvedValue(project);

      const result = await repository.findById(1);
      expect(result).toEqual(project);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 } as any);
    });

    it('should return null when not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      const result = await repository.findById(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new project', async () => {
      const data = { title: 'New Project' };
      const created = makeProject({ id: 1, title: 'New Project' });
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await repository.create(data);
      expect(result).toEqual(created);
      expect(mockRepo.create).toHaveBeenCalledWith(data);
      expect(mockRepo.save).toHaveBeenCalledWith(created);
    });
  });

  describe('update', () => {
    it('should merge and save when project exists', async () => {
      const existing = makeProject({ id: 1, title: 'Old' });
      const updated = makeProject({ id: 1, title: 'New' });
      mockRepo.findOneBy.mockResolvedValue(existing);
      mockRepo.save.mockResolvedValue(updated);

      const result = await repository.update(1, { title: 'New' });
      expect(result).toEqual(updated);
      expect(mockRepo.merge).toHaveBeenCalledWith(existing, { title: 'New' });
    });

    it('should return null when project does not exist', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      const result = await repository.update(999, { title: 'New' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return true when deletion is successful', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await repository.delete(1);
      expect(result).toBe(true);
    });

    it('should return false when nothing was deleted', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 0, raw: {} });

      const result = await repository.delete(999);
      expect(result).toBe(false);
    });
  });
});
