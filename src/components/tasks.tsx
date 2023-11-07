import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { useEffect, useState } from 'react'

interface Column {
  id: 'taskId' | 'mode' | 'prompt' | 'status' | 'generations';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'taskId', label: 'TaskId', minWidth: 170 },
  { id: 'mode', label: 'Mode', minWidth: 100 },
  {
    id: 'prompt',
    label: 'Prompt',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'generations',
    label: 'Images',
    minWidth: 170,
    align: 'right',
  },
];

const renderItem = (key: Column['id'], item: any) => {
  if (key === 'generations') {
    return (
      <ul className='flex items-center'>
        {
          item[key].results?.map((i: any, idx: number) => (
            <li key={idx} >
              <img src={`/sdapi/task/read?name=${i.image}`} alt="" className='w-[50px]' />
            </li>
          ))
        }
      </ul>
    )
  }
  if (key === 'mode') {
    return (
      <span>
        { item[key] === 1 ? 'text2img' : 'img2img' }
      </span>
    )
  }
  if (key === 'status') {
    return (
      <span>
        { item[key] === 1 ? 'pending' : 'completed' }
      </span>
    )
  }
  if (key === 'prompt') {
    return (
      <span>
        { item.payload.prompt }
      </span>
    )
  }
  return item[key]
}

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [total, setTotal] = useState(0)

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    loadTasks(newPage + 1)
  };

  const loadTasks = async (pn = 1) => {
    const res = await fetch(`/sdapi/task/list?pn=${pn}&ps=${rowsPerPage}`)
    const data = await res.json()
    console.log('===== new tasks', data.data.list.map((i: any) => i.id).join(', '))
    setTasks(data.data.list)
    setTotal(data.data.total)
  }

  useEffect(() => {
    loadTasks(1)
  }, [])

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, textAlign: 'center' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              tasks
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        return (
                          <TableCell sx={{ textAlign: 'center' }} key={column.id} align={column.align}>
                            { renderItem(column.id, row) }
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  );
                })
              }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  )
}