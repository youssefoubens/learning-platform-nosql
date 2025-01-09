

int getoccurrence(int *t, int element)
{
    int count = 0;
    for (int i = 0; i < sizeof(t); i++)
    {
        if (t[i] == element)
        {
            count++;
        }
    }
    return count;
}

int occurence(int debut, int fin, int *t, int element)
{
    if (debut == fin)
    {
        if (t[debut] == element)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    }

    int mid = (debut + fin) / 2;
    if (t[mid] >= element)
    {
        return occurence(debut, mid, t, element);
    }
}

int main()
{
}