'use client';
import Image from 'next/image';
import { useEffect, useState } from "react";

type Props = {
  params: { id: string };
};

type ReceiptResult = {
  url: string;
  merchantName: string;
  merchantAddress: string;
  merchantPhoneNumber: string;
  transactionDate: string;
  transactionTime: string;
  total: number;
  totalTax: number;
};

const AnalysisResultDetail = ({ params }: Props) =>
{
  const [receiptResult, setReceiptResult] = useState<ReceiptResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const parseAnalysisResult = (data: any): ReceiptResult =>
  {
    const analysisResult = data.analysisResult.documents[0].fields;
    return {
      url: data.url,
      merchantName: analysisResult.MerchantName?.value || '',
      merchantAddress: analysisResult.MerchantAddress?.value?.streetAddress || '',
      merchantPhoneNumber: analysisResult.MerchantPhoneNumber?.value || '',
      transactionDate: analysisResult.TransactionDate?.value || '',
      transactionTime: analysisResult.TransactionTime?.value || '',
      total: analysisResult.Total?.value || 0,
      totalTax: analysisResult.TotalTax?.value || 0,
    };
  };


  useEffect(() =>
  {
    const fetchReceiptResult = async () =>
    {
      const apiHost = process.env.NEXT_PUBLIC_API_HOST;
      try
      {
        const response = await fetch(`${apiHost}/receipt/${params.id}`);
        if (!response.ok)
        {
          throw new Error('Failed to fetch receipt');
        }
        const result = await response.json();
        setReceiptResult(parseAnalysisResult(result));
      } catch (err: any)
      {
        setError(err.message);
      } finally
      {
        setLoading(false);
      }
    }

    fetchReceiptResult();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error)
  {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap justify-between">
      <div className="flex-1 min-w-[300px] max-w-[50%]">
        <Image src={receiptResult?.url!} alt="Receipt Image" className="w-full h-auto" />
      </div>
      <div className="flex-1 min-w-[300px] max-w-[50%] p-4">
        <h1 className="flex-1 min-w-[300px] max-w-[50%] p-4">Receipt</h1>
        <p className="mb-2"><strong>id:</strong>{params.id}</p>
        <p className="mb-2"><strong>merchantName:</strong> {receiptResult?.merchantName}</p>
        <p className="mb-2"><strong>merchantAddress:</strong> {receiptResult?.merchantAddress}</p>
        <p className="mb-2"><strong>merchantPhoneNumber:</strong> {receiptResult?.merchantPhoneNumber}</p>
        <p className="mb-2"><strong>transactionDate:</strong> {receiptResult?.transactionDate}</p>
        <p className="mb-2"><strong>transactionTime:</strong> {receiptResult?.transactionTime}</p>
        <p className="mb-2"><strong>total:</strong> {receiptResult?.total}</p>
        <p className="mb-2"><strong>totalTax:</strong> {receiptResult?.totalTax}</p>
      </div>
    </div>
  );
}

export default AnalysisResultDetail;
