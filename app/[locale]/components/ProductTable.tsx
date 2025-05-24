/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/[locale]/components/ui/table';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/app/[locale]/components/ui/button';
import { useTranslations } from 'next-intl';
import { formatDateTime } from '@/lib/utils';
import Rating from './shared/product/rating';
import Image from 'next/image';
import { Product } from '@/types';
import React from 'react';
import PageDownLoad from '../(root)/product/[slug]/page-download';
import PageLink from '../(root)/product/[slug]/page-link';
import Pagination from './shared/pagination';

export default function ProductTable({
  products,
  totalPages,
  currentPage,
}: {
  products: Product[];
  totalPages: number | null;
  currentPage: number;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const t = useTranslations('Admin');

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('Product_Name')}</TableHead>
            <TableHead>{t('Images')}</TableHead>
            <TableHead>{t('CATEGORY')}</TableHead>
            <TableHead>{t('Create_Time')}</TableHead>
            <TableHead>{t('RATING')}</TableHead>
            <TableHead>{t('Description')}</TableHead>
            <TableHead className="w-[100px]">{t('ACTIONS')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <React.Fragment key={product.slug}>
              <TableRow>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Image
                    priority={true}
                    src={product.images![0] || '/images/logo.webp'}
                    alt={product.name}
                    className="aspect-square object-cover rounded"
                    height={50}
                    width={50}
                  />
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <div className="flex  items-center">
                    <Calendar className="h-3 " />
                    {formatDateTime(product.createdAt).dateTime}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Rating value={Number(product.rating)} />
                  </div>
                </TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(product.id)}
                  >
                    {expandedId === product.id ? (
                      <div className="flex gap-2 items-center">
                        <span>查看讲义</span> <ChevronUp />
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <span>查看讲义</span> <ChevronDown />
                      </div>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedId === product.id && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <ul>
                      {product.files.map((i: any, index: number) => (
                        <li className="mt-2 mb-2" key={index}>
                          <div className="flex justify-between items-center">
                            <span>{i.name}</span>
                            <div className="flex gap-2">
                              <PageDownLoad pdfUrl={i.url} pdfName={i.name} />
                              <PageLink url={i.url} />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center space-x-2 mt-4">
        {totalPages && totalPages > 1 && (
          <Pagination page={currentPage} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
}
