import { Button } from '@/app/[locale]/components/ui/button';
import { Input } from '@/app/[locale]/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/[locale]/components/ui/select';
import { getAllCategories } from '@/lib/actions/product.actions';
import { SearchIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const Search = async () => {
  const categorise = await getAllCategories();
  const t = await getTranslations('Common');

  return (
    <form action="/search" method="GET">
      <div className="flex w-full max-w-sm item-center space-x-2">
        <Select name="category">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('All')}></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={'All'} value={'all'}>
              {t('All')}
            </SelectItem>
            {categorise.map((x) => (
              <SelectItem key={x.category} value={x.category}>
                {x.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          placeholder={t('Search_Loading')}
          className="md:w-[100px] lg:w-[300px]"
        />
        <Button>
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;
