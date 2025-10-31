import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundWhileDeleteException } from '../../common/helpers/utils.helper';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

describe('AuthorService', () => {
  let service: AuthorService;
  let repository: Repository<Author>;

  const mockAuthor = {
    id: 1,
    firstName: 'Tanjin',
    lastName: 'Alam',
    bio: 'Tanjin Alam is a passionate software engineer with a strong focus on building scalable and efficient systems. With years of hands-on experience, he blends creativity and technical expertise to craft impactful digital solutions that drive innovation.',
    birthDate: new Date('1975-03-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    books: [],
  } as Author;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repository = module.get<Repository<Author>>(getRepositoryToken(Author));

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'Tanjin',
        lastName: 'Alam',
        bio: 'Tanjin Alam is a passionate software engineer with a strong focus on building scalable and efficient systems. With years of hands-on experience, he blends creativity and technical expertise to craft impactful digital solutions that drive innovation.',
        birthDate: '1975-03-15',
      };

      mockRepository.create.mockReturnValue(mockAuthor);
      mockRepository.save.mockResolvedValue(mockAuthor);

      const result = await service.create(createAuthorDto);

      expect(repository.create).toHaveBeenCalledWith(createAuthorDto);
      expect(repository.save).toHaveBeenCalledWith(mockAuthor);
      expect(result).toEqual(mockAuthor);
      expect(result.firstName).toBe('Tanjin');
      expect(result.lastName).toBe('Alam');
    });

    it('should create author with minimum required fields (firstName and lastName)', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'Tanjin',
        lastName: 'Alam',
      };

      const minimalAuthor = {
        ...mockAuthor,
        bio: undefined,
        birthDate: undefined,
      };

      mockRepository.create.mockReturnValue(minimalAuthor);
      mockRepository.save.mockResolvedValue(minimalAuthor);

      const result = await service.create(createAuthorDto);

      expect(result.firstName).toBe('Tanjin');
      expect(result.lastName).toBe('Alam');
      expect(repository.create).toHaveBeenCalledWith(createAuthorDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated authors', async () => {
      const pagination = {
        page: 0,
        limit: 10,
        size: 10,
        offset: 0,
      };

      const filterAuthorDto = {};

      mockRepository.findAndCount.mockResolvedValue([[mockAuthor], 1]);

      const result = await service.findAll(pagination, filterAuthorDto);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: undefined,
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result.item).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(0);
      expect(result.limit).toBe(10);
      expect(result.hasNextPage).toBe(false);
    });

    it('should filter authors by firstName', async () => {
      const pagination = {
        page: 0,
        limit: 10,
        size: 10,
        offset: 0,
      };

      const filterAuthorDto = {
        firstName: 'Tanjin',
      };

      mockRepository.findAndCount.mockResolvedValue([[mockAuthor], 1]);

      const result = await service.findAll(pagination, filterAuthorDto);

      expect(repository.findAndCount).toHaveBeenCalled();
      expect(result.item).toHaveLength(1);
      expect(result.item[0].firstName).toBe('Tanjin');
    });

    it('should filter authors by lastName', async () => {
      const pagination = {
        page: 0,
        limit: 10,
        size: 10,
        offset: 0,
      };

      const filterAuthorDto = {
        lastName: 'Alam',
      };

      mockRepository.findAndCount.mockResolvedValue([[mockAuthor], 1]);

      const result = await service.findAll(pagination, filterAuthorDto);

      expect(repository.findAndCount).toHaveBeenCalled();
      expect(result.item).toHaveLength(1);
      expect(result.item[0].lastName).toBe('Alam');
    });

    it('should return hasNextPage as true when more items exist', async () => {
      const pagination = {
        page: 0,
        limit: 1,
        size: 1,
        offset: 0,
      };

      const filterAuthorDto = {};

      mockRepository.findAndCount.mockResolvedValue([[mockAuthor], 5]);

      const result = await service.findAll(pagination, filterAuthorDto);

      expect(result.hasNextPage).toBe(true);
      expect(result.total).toBe(5);
    });
  });

  describe('findOne', () => {
    it('should return an author by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockAuthor);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockAuthor);
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException when author does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Author with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should successfully update an author', async () => {
      const updateAuthorDto: UpdateAuthorDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updatedAuthor = {
        ...mockAuthor,
        ...updateAuthorDto,
      };

      mockRepository.findOne.mockResolvedValue(mockAuthor);
      mockRepository.merge.mockReturnValue(updatedAuthor);
      mockRepository.save.mockResolvedValue(updatedAuthor);

      const result = await service.update(1, updateAuthorDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(repository.merge).toHaveBeenCalledWith(
        mockAuthor,
        updateAuthorDto,
      );
      expect(repository.save).toHaveBeenCalledWith(updatedAuthor);
      expect(result.firstName).toBe('Updated');
      expect(result.lastName).toBe('Name');
    });

    it('should throw NotFoundException when updating non-existent author', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const updateAuthorDto: UpdateAuthorDto = {
        firstName: 'Updated',
      };

      await expect(service.update(999, updateAuthorDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update only provided fields', async () => {
      const updateAuthorDto: UpdateAuthorDto = {
        bio: 'Updated bio only',
      };

      const updatedAuthor = {
        ...mockAuthor,
        bio: 'Updated bio only',
      };

      mockRepository.findOne.mockResolvedValue(mockAuthor);
      mockRepository.merge.mockReturnValue(updatedAuthor);
      mockRepository.save.mockResolvedValue(updatedAuthor);

      const result = await service.update(1, updateAuthorDto);

      expect(result.firstName).toBe('Tanjin'); // Unchanged
      expect(result.lastName).toBe('Alam'); // Unchanged
      expect(result.bio).toBe('Updated bio only'); // Changed
    });
  });

  describe('remove', () => {
    it('should delete an author', async () => {
      mockRepository.findOne.mockResolvedValue(mockAuthor);
      mockRepository.remove.mockResolvedValue(mockAuthor);

      await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['books'],
      });
      expect(repository.remove).toHaveBeenCalledWith(mockAuthor);
    });

    it('should throw NotFoundWhileDeleteException when deleting non-existent author', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        NotFoundWhileDeleteException,
      );
    });
  });
});
