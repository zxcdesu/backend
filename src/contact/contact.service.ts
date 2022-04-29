import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ProjectService } from 'src/project/project.service';
import { UpdateContactInput } from './dto/update-contact.input';

@Injectable()
export class ContactService {
  private readonly messagingUrl: string;
  private readonly contactsUrl: string;

  constructor(
    private readonly projectService: ProjectService,
    configService: ConfigService,
  ) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async findAll(authorization: string) {
    try {
      const contacts = await axios.get<any[]>(
        this.contactsUrl.concat('/contacts'),
        {
          headers: {
            authorization,
          },
        },
      );

      const userIds = contacts.data.map((c) => c.assignedTo).filter(Boolean);
      if (userIds.length > 0) {
        const users = await this.projectService.getUsers(
          authorization,
          userIds.join(','),
        );

        contacts.data.forEach((c) => {
          c.assignedTo = users.find((u) => u.id === c.assignedTo);
        });
      }

      return contacts.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async count(authorization: string) {
    try {
      const res = await axios.get<any>(
        this.contactsUrl.concat('/contacts/count'),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      console.log(e);

      throw new BadRequestException(e.response.data);
    }
  }

  async findOne(authorization: string, id: number) {
    try {
      const res = await axios.get<any>(
        this.contactsUrl.concat(`/contacts/${id}`),
        {
          headers: {
            authorization,
          },
        },
      );

      if (res.data.assignedTo) {
        const users = await this.projectService.getUsers(
          authorization,
          res.data.assignedTo,
        );

        res.data.assignedTo = users[0];
      }

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(authorization: string, input: UpdateContactInput) {
    try {
      const res = await axios.patch<any>(
        this.contactsUrl.concat(`/contacts/${input.id}`),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      await axios.patch<any>(
        this.messagingUrl.concat(`/chats/${res.data.chatId}`),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      if (res.data.assignedTo) {
        const users = await this.projectService.getUsers(
          authorization,
          res.data.assignedTo,
        );

        res.data.assignedTo = users[0];
      }

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async remove(authorization: string, id: number) {
    try {
      const res = await axios.delete<any>(
        this.contactsUrl.concat(`/contacts/${id}`),
        {
          headers: {
            authorization,
          },
        },
      );

      await axios.delete<any>(
        this.messagingUrl.concat(`/chats/${res.data.chatId}`),
        {
          headers: {
            authorization,
          },
        },
      );

      if (res.data.assignedTo) {
        const users = await this.projectService.getUsers(
          authorization,
          res.data.assignedTo,
        );

        res.data.assignedTo = users[0];
      }

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async addTag(authorization: string, id: number, tagId: number) {
    try {
      const res = await axios.post<any>(
        this.contactsUrl.concat(`/contacts/${id}/tags`),
        {
          tagId,
        },
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data.tag;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async delTag(authorization: string, id: number, tagId: number) {
    try {
      const res = await axios.delete<any>(
        this.contactsUrl.concat(`/contacts/${id}/tags/${tagId}`),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data.tag;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async getHistory(authorization: string, id: number) {
    try {
      const res = await axios.get<any[]>(
        this.contactsUrl.concat(`/contacts/${id}/history`),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }
}
